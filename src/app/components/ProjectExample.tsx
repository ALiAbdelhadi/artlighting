import Link from 'next/link'

const ProjectExample = () => {
    return (
        <section className="flex flex-col md:flex-row items-start md:items-center pb-16 md:pb-20">
            <div className="w-full md:w-1/2">
                <div className="text-sm text-muted-foreground  mb-5">13 / May / 24</div>
                <img src="/projects/projectIamge 1.webp" alt="Dining area" className="rounded-md" />
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-8">
                <div className="text-sm text-muted-foreground mb-2">- Monday 13 / May / 24</div>
                <h2 className="md:text-2xl text-xl font-bold sm:mb-4 mb-1">
                    Project: A striking eye-catcher above the dining area, Werkendam (The Netherlands)
                </h2>
                <p className="text-muted-foreground sm:mb-6 mb-4">
                    Dinner often serves as a moment of peace where families come together to talk through the day. The
                    dining area
                    serves as a focal point in this. While functional lighting is important, creating the feeling of
                    home with the
                    right atmosphere and warmth are just as important. Using the HALO LED ring lights supports this.
                </p>
                <Link href="All-Projects/Project-one" className="font-semibold text-primary">
                    READ MORE
                </Link>
            </div>
        </section>
    )
}

export default ProjectExample