import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PersonHeader } from "./PersonHeader";
import { PersonBasicInfo } from "./PersonBasicInfo";
import { ReportedInformation } from "./ReportedInformation";
import { PersonSidebar } from "./PersonSidebar";
import { ImageModal } from "./ImageModal";
import { PersonDetailsLoading } from "./PersonDetailsLoading";
import { PersonNotFound } from "./PersonNotFound";

import { usePersonDetails } from "@/hooks/usePersonDetails";
import { useInformationSorting } from "@/hooks/useInformationSorting";

import { buscarInformacoes } from "@/services/apiService";

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { sortOrder, toggleSortOrder, sortInformacoesByDate } =
    useInformationSorting();
  const { person, informacoes, loading, setInformacoes } = usePersonDetails({
    personId: id,
    sortInformacoesByDate,
  });

  const handleNavigateBack = () => navigate("/");

  const handleImageClick = (imageUrl: string | null) => {
    setSelectedImage(imageUrl);
  };

  const handleToggleSortOrder = () => {
    toggleSortOrder();
    if (informacoes.length > 0) {
      const sortedInfos = sortInformacoesByDate([...informacoes]);
      setInformacoes(sortedInfos);
    }
  };

  const handleInformationSubmit = async () => {
    console.log("Informação enviada");
    setDialogOpen(false);

    if (person?.ultimaOcorrencia?.ocoId) {
      try {
        const infos = await buscarInformacoes(person.ultimaOcorrencia.ocoId);
        const sortedInfos = sortInformacoesByDate(infos);
        setInformacoes(sortedInfos);
      } catch (error) {
        console.error("Erro ao recarregar informações:", error);
      }
    }
  };

  if (loading) {
    return <PersonDetailsLoading />;
  }

  if (!person) {
    return <PersonNotFound onNavigateBack={handleNavigateBack} />;
  }

  const isDesaparecido =
    person.ultimaOcorrencia?.encontradoVivo === undefined ||
    person.ultimaOcorrencia?.encontradoVivo === null ||
    !person.ultimaOcorrencia?.dataLocalizacao;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />

      <div className="container mx-auto p-6 relative z-10">
        <PersonHeader
          person={person}
          isDesaparecido={isDesaparecido}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onNavigateBack={handleNavigateBack}
          onInformationSubmit={handleInformationSubmit}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[50rem]">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <PersonBasicInfo person={person} onImageClick={handleImageClick} />

            <ReportedInformation
              informacoes={informacoes}
              sortOrder={sortOrder}
              onToggleSortOrder={handleToggleSortOrder}
              onImageClick={handleImageClick}
            />
          </div>

          <PersonSidebar person={person} onImageClick={handleImageClick} />
        </div>
      </div>

      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
