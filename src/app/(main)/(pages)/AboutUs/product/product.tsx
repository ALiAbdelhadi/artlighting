import styles from "./product.module.css"
import Image from "next/legacy/image";
import dynamic from 'next/dynamic';
import Container from "@/app/components/Container";

const Button = dynamic(() => import("../../../../components/Button/button"), { ssr: false });

function Product() {
    return (
        <div className={`${styles.product} pb-16 `}>
            <div className={styles.specialHeading}>Products</div>
            <Container>
                <div className={styles.aboutContent}>
                    <div className={styles.image}>
                        <Image className={styles.img} src="/indoor/products500/jy-535-5w/JY-535-5W (1).png"
                            alt="product-jy-539-7w" width="350" height="350" />
                    </div>
                    <div className={styles.text}>
                        <h3 className={styles.h3}>Indoor Lighting</h3>
                        <p className={styles.anim1}>
                            Indoor lighting is more than just a source of light. It is also a
                            powerful tool that can be used to create different moods and
                            feelings. Lighting can make a space feel brighter or warmer, more
                            formal or more relaxed.
                        </p>
                        <Button destination="./category/Balcom/IndoorLighting" />
                    </div>
                </div>
            </Container>
            <Container>
                <div className={styles.aboutContent}>
                    <div className={styles.image}>
                        <Image className={styles.img}
                            src="/outdoor/Bollard/JY-BO-001-650MM-8W/JY-BO-001-650MM-8W (1).png"
                            alt="product-jy-bo-001-650mm-8w" width="350" height="350" />
                    </div>
                    <div className={styles.text}>
                        <h3 className={styles.h3}>Outdoor Lighting</h3>
                        <p className={styles.anim1}>
                            Outdoor lighting is more than just a way to see in the dark. It is
                            also an important tool for creating ambiance, enhancing safety,
                            and extending the use of outdoor spaces. Well-designed outdoor
                            lighting can make a space feel more inviting, more secure, and
                            more enjoyable.
                        </p>
                        <Button destination="./category/Balcom/OutdoorLighting" />
                    </div>
                </div>
            </Container>
            <Container>
                <div className={styles.aboutContent}>
                    <div className={styles.image}>
                        <Image className={styles.img} src="/chandelier/MC6091/MC6091-H3.png" alt="chandelier product 1"
                            width="350" height="350" />
                    </div>
                    <div className={styles.text}>
                        <h3 className={styles.h3}>Chandelier</h3>
                        <p className={styles.anim1}>
                            Chandelier lighting is a type of lighting that utilizes a chandelier to provide
                            illumination.
                            Chandeliers
                            are typically suspended from the ceiling and feature multiple arms that support light bulbs
                            or
                            candles. They
                            can be crafted from a diverse range of materials, including crystal, glass, metal, and wood.
                        </p>
                        <Button destination="./category/MisterLed/Chandelier" />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Product;