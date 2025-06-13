import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient.js";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Link as LinkIcon,
  Tag,
  List,
} from "lucide-react";

/****************************************************************************************
 * Utils
 ****************************************************************************************/
const normalizeTechnologies = (tech) => {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string" && tech.trim() !== "")
    return tech.split(",").map((t) => t.trim());
  return [];
};

/****************************************************************************************
 * Constants
 ****************************************************************************************/
const PROJECTS_TABLE = "projects";
const PROJECTS_BUCKET = "project-images";

/****************************************************************************************
 * Component
 ****************************************************************************************/
const AdminProjetosPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**************************************************************************************
   * Data Fetching
   **************************************************************************************/
  const fetchProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed = (data || []).map((p) => ({
        ...p,
        technologies: normalizeTechnologies(p.technologies),
      }));
      setProjects(parsed);
    } catch (err) {
      toast({
        title: "Erro ao Carregar Projetos",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**************************************************************************************
   * Storage helpers
   **************************************************************************************/
  const handleImageUpload = async (file) => {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .upload(fileName, file);

    if (error) {
      toast({
        title: "Erro no Upload da Imagem",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(PROJECTS_BUCKET)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  /**************************************************************************************
   * Modal helpers
   **************************************************************************************/
  const openModal = (project = null) => {
    setCurrentProject(project);

    if (project) {
      setTitle(project.title);
      setDescription(project.description || "");
      setTechnologies((project.technologies || []).join(", "));
      setGithubUrl(project.github_url || "");
      setLiveUrl(project.live_url || "");
      setImageUrl(project.image_url || "");
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setTechnologies("");
      setGithubUrl("");
      setLiveUrl("");
      setImageUrl("");
      setImageFile(null);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  /**************************************************************************************
   * CRUD – Submit
   **************************************************************************************/
  const handleSubmitProject = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // 1. Upload image if provided
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const uploadedUrl = await handleImageUpload(imageFile);
      if (!uploadedUrl) {
        setIsSubmitting(false);
        return; // erro já tratado no handleImageUpload
      }
      finalImageUrl = uploadedUrl;
    }

    // 2. Build data object
    const techArray = normalizeTechnologies(technologies);

    const projectData = {
      title,
      description,
      technologies: techArray,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      image_url: finalImageUrl || null,
    };

    // 3. Insert or update
    try {
      if (currentProject) {
        projectData.updated_at = new Date().toISOString();
        const { error } = await supabase
          .from(PROJECTS_TABLE)
          .update(projectData)
          .eq("id", currentProject.id);
        if (error) throw error;
      } else {
        projectData.created_at = new Date().toISOString();
        const { error } = await supabase
          .from(PROJECTS_TABLE)
          .insert(projectData);
        if (error) throw error;
      }

      toast({
        title: currentProject ? "Projeto Atualizado!" : "Projeto Adicionado!",
        description: `O projeto "${title}" foi salvo com sucesso.`,
      });

      fetchProjects();
      closeModal();
    } catch (err) {
      toast({
        title: "Erro ao Salvar Projeto",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**************************************************************************************
   * CRUD – Delete
   **************************************************************************************/
  const handleDeleteProject = async (id, projectTitle, projectImageUrl) => {
    if (!window.confirm(`Tem certeza que deseja excluir o projeto "${projectTitle}"?`)) return;

    setIsLoading(true);
    try {
      // 1. Delete row
      const { error: dbError } = await supabase
        .from(PROJECTS_TABLE)
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      // 2. Delete image from storage
      if (projectImageUrl) {
        const fileName = decodeURIComponent(
          projectImageUrl.substring(projectImageUrl.lastIndexOf("/") + 1)
        );
        const { error: storageError } = await supabase.storage
          .from(PROJECTS_BUCKET)
          .remove([fileName]);

        // ignore "resource not found"
        if (storageError && storageError.message !== "The resource was not found")
          console.warn("Erro ao excluir imagem: ", storageError.message);
      }

      toast({
        title: "Projeto Excluído!",
        description: `O projeto "${projectTitle}" foi removido.`,
      });
      fetchProjects();
    } catch (err) {
      toast({
        title: "Erro ao Excluir Projeto",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**************************************************************************************
   * Render
   **************************************************************************************/
  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Projetos</h1>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
        >
          <PlusCircle size={18} className="mr-2" /> Adicionar Novo Projeto
        </Button>
      </div>

      {/* List / Empty state */}
      {projects.length === 0 && !isLoading ? (
        <Card className="glass-card">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <List size={48} className="mx-auto mb-4 text-primary/50" />
            <p className="text-lg">Nenhum projeto cadastrado ainda.</p>
            <p>Clique em "Adicionar Novo Projeto" para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col glass-card hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {project.title}
                </CardTitle>
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="mt-2 rounded-md h-40 w-full object-cover"
                  />
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-2 h-16 overflow-hidden">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="text-xs space-x-1 mb-3">
                    <span className="font-semibold">Tecnologias:</span>
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(project)}
                  disabled={isSubmitting}
                >
                  <Edit size={14} className="mr-1" /> Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id, project.title, project.image_url)}
                  disabled={isSubmitting || isLoading}
                >
                  <Trash2 size={14} className="mr-1" /> Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {currentProject ? "Editar Projeto" : "Adicionar Novo Projeto"}
            </h2>
            <form onSubmit={handleSubmitProject} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="projTitle">Título do Projeto</Label>
                <Input
                  id="projTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="projDesc">Descrição</Label>
                <Textarea
                  id="projDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Technologies */}
              <div>
                <Label htmlFor="projTechs">Tecnologias (separadas por vírgula)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="projTechs"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="React, Node.js, TailwindCSS"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <Label htmlFor="projImageFile">Imagem do Projeto (Upload)</Label>
                <Input
                  id="projImageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {imageUrl && !imageFile && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    Imagem atual: {" "}
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {imageUrl.substring(imageUrl.lastIndexOf("/") + 1)}
                    </a>
                  </p>
                )}
              </div>

              {/* GitHub */}
              <div>
                <Label htmlFor="projGithub">URL do GitHub (opcional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="projGithub"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/usuario/projeto"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Live URL */}
              <div>
                <Label htmlFor="projLive">URL Online (opcional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="projLive"
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://projeto.online.com"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? "Salvando..." : "Salvar Projeto"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminProjetosPage;
