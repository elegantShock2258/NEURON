"use client";
import Image from "next/image";
import styles from "./card.module.css";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";

export default function Card({
  type,
  formats,
  text,
}: {
  type: "Image" | "PDF";
  formats: string[];
  text: string;
}) {
  let router = useRouter();
  function handleFiles(acceptedFiles: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("image", reader.result as string);
      return reader.result;
    };
    reader.readAsDataURL(acceptedFiles[0]);

    let fd = new FormData();
    fd.append("file", acceptedFiles[0]);
    fetch("http://localhost:4437/", {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("result", JSON.stringify(data));
        router.push("/result");
      });
  }
  return (
    <Dropzone onDrop={(acceptedFiles) => handleFiles(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <div className={styles.parent} {...getRootProps()}>
          <div className={styles.overlay}>
            {type == "PDF" && <div className={styles.badge}>Coming Soon</div>}
          </div>
          <div
            className={`${styles.cardParent} ${type == "Image" ? styles.ImageCard : styles.PDFcard}`}
          >
            <input {...getInputProps()} />
            <Image src="/plus.png" width={68} height={68} alt="s" />
            <div className={styles.uploadAn}>Upload An {type}</div>
            <div
              className={`${styles.textbox} ${type == "Image" ? styles.imageTextBox : styles.PDFTextbox}`}
            >
              {text}
            </div>
            <div className={styles.supportedFormats}>
              Supported Formats:
              <div className={styles.formatList}>
                {formats.map((format) => {
                  return (
                    <div
                      key={format}
                      className={`${styles.format} ${type == "Image" ? styles.ImageFormat : styles.PDFFormat}`}
                    >
                      {format}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
