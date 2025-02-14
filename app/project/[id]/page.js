"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const transition = { duration: 1.4, ease: [0.6, 0.01, 0, 0.9] };

export default function ModelPage() {
  return (
    <motion.div
      className="w-full"
      initial={{ height: "100vh" }}
      animate={{ height: "auto" }}
      transition={{ ...transition }}
    >
      <motion.div className="flex justify-center items-center h-full w-full">
        <motion.div
          className="aspect-video"
          initial={{
            width: "524px",
          }}
          animate={{
            width: "100%",
            transition: { ...transition },
          }}
        >
          <motion.div className="relative w-full h-full">
            <Image
              src="/yasmeen.webp"
              alt="Yasmeen Tariq"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 80vw, 1440px"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
