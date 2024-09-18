import Container from "@/app/components/Container"
import styles from "./missionAndvision.module.css"

function Mission() {
    return (
        <div className={`${styles.mission}`}>
            <Container>
                <div className={`${styles.aboutContent}`}>
                    <h2 className={`${styles.h2}`}>
                        Our mission is to recognize the world about the actual lighting
                    </h2>
                    <h2 className={`${styles.h2} mt-[50px]`}>
                        To be the leader in shaping human experience through innovative lighting solutions. We envision
                        a
                        world where light actively enhances environments, fostering well-being, productivity, and focus.
                    </h2>
                </div>
            </Container>
        </div>
    )
}

export default Mission