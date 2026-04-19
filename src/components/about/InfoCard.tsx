export const InfoCard = (eventStructure: {
  title: string;
  details: string;
}) => {
  return (
    <div className="rounded-lg border-l-4 border-accent bg-white p-6 shadow-sm">
      <h3 className="mb-3 font-din text-xl">{eventStructure.title}</h3>

      <p className="text-lg text-gray-700">{eventStructure.details}</p>
    </div>
  );
};
