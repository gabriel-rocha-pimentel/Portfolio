import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient.js";
import { useToast } from "@/components/ui/use-toast";

/***************************
 * Constants & helpers
 ***************************/
const PROJECTS_TABLE = "projects";
const PROJECTS_BUCKET = "project-images";

const normalizeTechnologies = (tech) => {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string" && tech.trim() !== "")
    return tech.split(",").map((t) => t.trim());
  return [];
};

/***************************
 * Hook – useProjects
 ***************************/
export const useProjects = (user) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetch all projects (latest first) */
  const refreshProjects = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(
        (data || []).map((p) => ({
          ...p,
          technologies: normalizeTechnologies(p.technologies),
        }))
      );
    } catch (err) {
      toast({
        title: "Erro ao Carregar Projetos",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  /** Delete a project (row + image) */
  const deleteProject = async (id, title, imageUrl) => {
    setIsLoading(true);
    try {
      // 1. Delete DB row
      const { error: dbError } = await supabase
        .from(PROJECTS_TABLE)
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      // 2. Delete image from storage
      if (imageUrl) {
        const fileName = decodeURIComponent(
          imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
        );
        const { error: storageError } = await supabase.storage
          .from(PROJECTS_BUCKET)
          .remove([fileName]);

        if (storageError && storageError.message !== "The resource was not found")
          console.warn("Erro ao excluir imagem:", storageError.message);
      }

      toast({
        title: "Projeto Excluído!",
        description: `O projeto "${title}" foi removido.`,
      });

      refreshProjects();
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

  return {
    projects,
    isLoading,
    refreshProjects,
    deleteProject,
  };
};