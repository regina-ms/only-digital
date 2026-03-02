import { Data } from "@/index"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import React, { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import styles from "./Slider.scss"
gsap.registerPlugin(useGSAP)

type Props = Pick<Data, "content">

function Slider({ content }: Props) {
  const slider = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        slider.current,
        {
          opacity: 0,
          duration: 1,
        },
        {
          opacity: 1,
          duration: 1,
        },
      )
    },
    { scope: slider, dependencies: [content] },
  )
  return (
    <div className={styles.wrapper} ref={slider}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={80}
        className={styles.slider}
        navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
      >
        {content.map((item) => {
          return (
            <SwiperSlide>
              <div className={styles.slide}>
                <div className={styles.year}>{item.year}</div>
                <div className={styles.text}>{item.text}</div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className={styles.navigations}>
        <button className={`slider-prev`} />
        <button className={`${styles.next} slider-next`} />
      </div>
    </div>
  )
}

export default Slider
