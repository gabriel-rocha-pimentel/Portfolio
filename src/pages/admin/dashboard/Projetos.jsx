import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Link as LinkIcon,
  Tag,
  List,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { useProjects } from "@/hooks/useProjects.js";
import { useProjectForm } from "@/hooks/useProjectForm.js";

/**********************************************
 * Component – AdminProjetosPage
 **********************************************/
const AdminProjetosPage = () => {
  const { user } = useAuth();

  // Hook: data layer (fetch, delete, refresh)
  const {
    projects,
    isLoading,
    deleteProject,
    refreshProjects,
  } = useProjects(user);

  // Hook: UI & form layer (modal, add / edit)
  const {
    /* modal */
    isModalOpen,
    openModal,
    closeModal,
    currentProject,

    /* form state */
    title,
    setTitle,
    description,
    setDescription,
    technologies,
    setTechnologies,
    githubUrl,
    setGithubUrl,
    liveUrl,
    setLiveUrl,
    imageUrl,
    setImageUrl,
    imageFile,
    setImageFile,

    /* submit */
    handleSubmitProject,
    isSubmitting,
  } = useProjectForm({
    user,
    onSuccess: refreshProjects
});

  /***************************************
   * Loading indicator while bootstraping
   ***************************************/
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
                  onClick={() => deleteProject(project.id, project.title, project.image_url)}
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
                    Imagem atual:{" "}
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