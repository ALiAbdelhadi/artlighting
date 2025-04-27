import Image from "next/image";
import Link from "next/link";

const ProjectExample = () => {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center pb-16 md:pb-20">
      <div className="w-full md:w-1/2 mt-5">
        <div className="text-sm  mb-5">19 / July / 23</div>
        <Image
          width={720}
          height={480}
          src="/projects/almaza-park/almaza-park-1.jpg"
          alt="almaza park"
          className="rounded-md w-[45rem] h-[30rem]"
        />
      </div>
      <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-8">
        <div className="text-sm text-muted-foreground mb-2">
          - Wednesday 19 / July / 23
        </div>
        <h2 className="md:text-2xl text-xl font-bold sm:mb-4 mb-1">
          Almaza Park is a premier mixed-use development that combines luxury
          Flood light And bollard.
        </h2>
        <p className="text-muted-foreground sm:mb-6 mb-4">
          Almaza Park is designed as a modern oasis integrating residential,
          commercial, and recreational areas. With a focus on sustainability and
          innovative architecture,
        </p>
        <Link
          href="/all-projects/almaza-park"
          className="font-semibold text-primary"
        >
          READ MORE
        </Link>
      </div>
    </section>
  );
};

export default ProjectExample;
