import Image from "next/image";

const PlancheThumbnail = (imageUrl: string, label: string, link: string) => {
  return (
    <div key={label} className="flex flex-col items-center">
      <span className="w-72 mt-2 font-bold text-balance">{label}</span>
      <Image
        alt="Schema"
        src={imageUrl}
        width={400}
        height={225}
        className="w-72 min-w-72 sm:min-w-[300px] sm:ml-4 border-2 mt-1 border-black cursor-pointer"
        onClick={() => window.open(`planche/${link}`, "_blank")}
      />
    </div>
  );
};

export default PlancheThumbnail;