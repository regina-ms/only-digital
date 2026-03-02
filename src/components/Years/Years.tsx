import Slider from "@/components/Slider/Slider"
import { getYearRange } from "@/features/getYearRange"
import { Data } from "@/index"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import React, { useRef } from "react"
import styles from "./Years.module.scss"
gsap.registerPlugin(useGSAP)

type Props = Pick<Data, "content">

function Years({ content }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const fromObj = { val: document.querySelector(".from").textContent }
      const toObj = { val: document.querySelector(".to").textContent }

      const currentRange = getYearRange(content)

      gsap.to(fromObj, {
        val: currentRange.from,
        duration: 2,
        onUpdate: function () {
          document.querySelector(".from").textContent = Math.round(
            parseInt(fromObj.val),
          ).toString()
        },
      })

      gsap.to(toObj, {
        val: currentRange.to,
        duration: 2,
        onUpdate: function () {
          document.querySelector(".to").textContent = Math.round(
            parseInt(toObj.val),
          ).toString()
        },
      })
    },

    { scope: containerRef, dependencies: [content] },
  )

  return (
    <div className={styles.wrapper}>
      {" "}
      <div className={`container ${styles.container}`} ref={containerRef}>
        <span className={`from ${styles.from}`}>0</span>
        <span className={`to ${styles.to}`}>0</span>
      </div>
      <Slider content={content} />
    </div>
  )
}

export default Years
