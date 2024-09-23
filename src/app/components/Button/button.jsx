import style from "@/app/components/Button/button.module.css"
import Link from 'next/link'

const Button = ({destination}) => {
    return (
        <span className={style.backgroundPro}>
            <Link href={destination} className={style.buttonTest} scroll={true}>
                <svg>
                    <rect x="0" fill="none" width="100%" height="100%"/>
                </svg>
                Discover more
            </Link>
        </span>
    )
}

export default Button