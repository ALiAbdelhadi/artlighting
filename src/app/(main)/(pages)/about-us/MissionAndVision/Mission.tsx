import Container from "@/app/components/Container"
function Mission() {
    return (
        <div className="py-16">
            <Container>
                <div className={`flex my-[0] flex-col md:max-w-screen-lg w-full`}>
                    <h2 className="md:text-3xl text-2xl font-medium">
                        Our mission is to recognize the world about the actual lighting
                    </h2>
                    <h2 className={"md:text-3xl text-2xl font-medium mt-[50px]"}>
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