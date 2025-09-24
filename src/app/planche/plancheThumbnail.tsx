import Image from "next/image";

type ThumbSize = {
  key: string;
  label: string;
  width: number;
  height: number;
};

const sizeClassMap: Record<string, string> = {
  mobile: "w-[340px] min-w-[340px]",
  small: "w-[400px] min-w-[400px]",
  medium: "w-[550px] min-w-[550px]",
  large: "w-[700px] min-w-[700px]",
  xlarge: "w-[850px] min-w-[850px]",
};

const PlancheThumbnail = (
  imageUrl: string,
  label: string,
  link: string,
  thumbSize?: ThumbSize
) => {
  const sizeKey = thumbSize?.key || "small";
  const sizeClass = sizeClassMap[sizeKey] || sizeClassMap.small;
  return (
    <div key={label} className="flex flex-col items-center">
      <span className={`${sizeClass} mt-2 font-bold text-balance`}>{label}</span>
      <a
        href={`planche/${link}`}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={0}
        aria-label={`Ouvrir la planche ${label} dans un nouvel onglet`}
        className={`${sizeClass} sm:ml-4 border-2 border-black box-border p-1 mt-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:z-10 block`}
      >
        <Image
          alt="Schema"
          src={imageUrl}
          width={thumbSize?.width || 400}
          height={thumbSize?.height || 225}
          className="w-full h-auto"
        />
      </a>
    </div>
  );
};

export default PlancheThumbnail;