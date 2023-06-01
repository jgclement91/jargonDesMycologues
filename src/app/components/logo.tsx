import Image from 'next/image'

const Logo = () => {
    return (
        <div className="logo">
            <Image
                src="/logo-cmm.png"
                alt="Logo Cercle des mycologues de Montréal"
                width={200}
                height={140}
            />
        </div>
    )
};

export default Logo;