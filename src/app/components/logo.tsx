import Image from 'next/image'

type Props = {
    compact?: boolean;
};

const Logo = ({ compact = false }: Props) => {
    return (
        <div className={`logo ${compact ? 'flex justify-center' : ''}`}>
            <Image
                src="/logo-cmm.png"
                alt="Logo Cercle des mycologues de Montréal"
                width={compact ? 120 : 200}
                height={compact ? 84 : 140}
            />
        </div>
    )
};

export default Logo;