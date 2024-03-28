import Image from "next/image";

const PlancheThumbnail = (imageUrl: string, label: string, link: string) => {
  return (
    <div key={label} className="flex flex-col">
      <span className="ml-2 mt-2">{label}</span>
      <Image
        alt="Schema"
        src={imageUrl}
        width={400}
        height={225}
        className="min-w-[300px] border-2 mt-1 ml-2 border-black cursor-pointer"
        onClick={() => window.open(`planche/${link}`, "_blank")}
      />
    </div>
  );
};

export default PlancheThumbnail;