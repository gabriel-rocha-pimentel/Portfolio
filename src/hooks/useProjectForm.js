import { useState } from "react";
import { supabase } from "@/lib/supabaseClient.js";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const PROJECTS_TABLE = "projects";
const PROJECTS_BUCKET = "project-images";

const normalizeTechnologies = (tech) => {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string" && tech.trim() !== "")
    return tech.split(",").map((t) => t.trim());
  return [];
};

/**
 * Hook – useProjectForm
 * Controla estado do modal + submit (add / edit)
 */
export const useProjectForm = ({ user, onSuccess }) => {
  const { toast } = useToast();

  /* Modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  /* Form fields */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /* Submit (add / edit)                                                */
  /* ------------------------------------------------------------------ */
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

    // 1. Upload image se fornecida
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const uploadedUrl = await handleImageUpload(imageFile);
      if (!uploadedUrl) {
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // 2. Monta o objeto payload
    const techArray = normalizeTechnologies(technologies);

    const payload = {
      title,
      description,
      technologies: techArray,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      image_url: finalImageUrl || null,
    };

    try {
      if (currentProject) {
        // Atualiza projeto existente
        payload.updated_at = new Date().toISOString();
        const { error } = await supabase
          .from(PROJECTS_TABLE)
          .update(payload)
          .eq("id", currentProject.id);
        if (error) throw error;
      } else {
        // Cria novo projeto - Gera UUID aqui
        payload.id = uuidv4();
        payload.created_at = new Date().toISOString();
        const { error } = await supabase
          .from(PROJECTS_TABLE)
          .insert(payload);
        if (error) throw error;
      }

      toast({
        title: currentProject ? "Projeto Atualizado!" : "Projeto Adicionado!",
        description: `O projeto "${title}" foi salvo com sucesso.`,
      });

      if (typeof onSuccess === "function") onSuccess();
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

  /* ------------------------------------------------------------------ */
  /* Exposed API                                                        */
  /* ------------------------------------------------------------------ */
  return {
    isModalOpen,
    openModal,
    closeModal,
    currentProject,
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
    handleSubmitProject,
    isSubmitting,
  };
};
