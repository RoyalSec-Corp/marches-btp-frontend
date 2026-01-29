import React from "react";
import { RiArrowLeftLine, RiUser3Line, RiFileTextLine, RiAttachment2, RiCheckLine, RiCloseLine, RiDownloadLine, RiEyeLine } from "react-icons/ri";

const Detail = ({ data, onBack }) => {
  if (!data) return null;
  const documents = [{ name: "Devis_YacineKone.pdf", url: "/documents/Devis_YacineKone.pdf" }, { name: "Planning_intervention.xlsx", url: "/documents/Planning_intervention.xlsx" }];

  return (
    <div className="px-6 py-8">
      <button onClick={onBack} className="mb-6 flex items-center text-blue-600 hover:underline"><RiArrowLeftLine className="mr-2" />Retour a la liste</button>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Detail de la candidature</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6"><div className="flex items-center gap-2"><RiUser3Line className="text-primary" /><span className="font-medium">Freelance :</span><span>{data.freelance}</span></div><div className="flex items-center gap-2"><RiFileTextLine className="text-primary" /><span className="font-medium">Projet :</span><span>{data.nom}</span></div><div className="flex items-center gap-2"><RiFileTextLine className="text-primary" /><span className="font-medium">Date :</span><span>{data.date}</span></div></div>
        <div className="mb-6"><h2 className="font-semibold text-gray-800 mb-2">Proposition :</h2><p className="text-gray-700">{data.proposition}</p></div>
        <div className="mb-6"><h2 className="font-semibold text-gray-800 mb-2">Documents joints :</h2><ul className="space-y-2">{documents.map((doc, i) => (<li key={i} className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-md"><div className="flex items-center gap-2 text-gray-700"><RiAttachment2 className="text-blue-600" />{doc.name}</div><div className="flex gap-3"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><RiEyeLine /> Voir</a><a href={doc.url} download className="text-gray-600 text-sm flex items-center gap-1 hover:underline"><RiDownloadLine /> Telecharger</a></div></li>))}</ul></div>
        <div className="flex gap-4"><button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition"><RiCheckLine />Accepter la candidature</button><button className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition"><RiCloseLine />Refuser la candidature</button></div>
      </div>
    </div>
  );
};

export default Detail;
