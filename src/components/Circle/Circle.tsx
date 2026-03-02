import Slider from '@/components/Slider/Slider'
import { Data } from "@/index"
import styles from "./Circle.module.scss"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import React, { useCallback, useRef } from "react"

gsap.registerPlugin(useGSAP)

type Props = {
  dots: Omit<Data, "content">[]
  setActive?: (id: string) => void
}

type DotRef = {
  element: HTMLElement
  hoverAnimation?: gsap.core.Timeline
  activeAnimation?: gsap.core.Timeline
}

function Circle({ dots, setActive }: Props) {
  const circle = useRef<HTMLDivElement>(null)
  const circleWrapper = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<DotRef[]>([])
  const activeDot = useRef<DotRef>(null)

  const getDotPosition = useCallback(
    ({ index, radius }: { index: number; radius: number; shift?: number }) => {
      const angle = (360 / dots.length) * index - 60
      const radian = (angle * Math.PI) / 180
      const x = Math.cos(radian) * radius
      const y = Math.sin(radian) * radius
      return { x, y }
    },
    [dots.length],
  )

  const getCircleRotation = useCallback(
    (clickedDotIndex: number) => {
      const currentRotation = Number(
        gsap.getProperty(circle.current, "rotation"),
      )

      const dotAngle = (360 / dots.length) * clickedDotIndex
      const targetRotation = -dotAngle

      let diff = targetRotation - currentRotation
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360

      return currentRotation + diff
    },
    [dots.length],
  )

  useGSAP(
    (context, contextSafe) => {
      const openDotAnimation = (dot: HTMLElement) => {
        const number = dot.querySelector(".number")
        return gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.5 },
          })
          .to(dot, {
            "--size": "56px",
            backgroundColor: "white",
            border: "1px solid, #303E5880",
          })
          .to(
            number,
            {
              opacity: 1,
              visibility: "visible",
            },
            "-=0.4",
          )
      }
      const activeDotAnimation = (dot: HTMLElement) => {
        const name = dot.querySelector(".name")
        return gsap
          .timeline({ paused: true })
          .to(name, { opacity: 1, visibility: "visible" })
      }
      const rotateCircleAnimation = (
        newActiveDot: DotRef,
        newActiveDotIndex: number,
      ) => {
        const newRotation = getCircleRotation(newActiveDotIndex)

        gsap.to(circle.current, {
          rotation: newRotation,
          duration: 0.6,
        })
        gsap.to(".dot", {
          rotation: -newRotation,
          duration: 0.6,
        })

        newActiveDot.hoverAnimation.play()
        newActiveDot.activeAnimation.play()
        activeDot.current.hoverAnimation.reverse()
        activeDot.current.activeAnimation.reverse()
        setActive(newActiveDot.element.id)
        activeDot.current = newActiveDot
      }
      const changeProgress = (targetIndex: number) => {
        const currentProgress = parseInt(
          document.querySelector(".currentDotIndex").textContent,
        )

        const newProgress = targetIndex + 1

        const fromIndex = { val: currentProgress }
        gsap.to(fromIndex, {
          val: newProgress,
          duration: 1,
          onUpdate: () => {
            document.querySelector(".currentDotIndex").textContent =
              `0${newProgress}`
          },
        })

        document.querySelector<HTMLButtonElement>(".next").disabled =
          newProgress === dotsRef.current.length
        document.querySelector<HTMLButtonElement>(".prev").disabled =
          newProgress === 1
      }

      const radius = Number(gsap.getProperty(circle.current, "--diameter")) / 2

      const dotMouseEnterHandle = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const dot = dotsRef.current.find((refs) => refs.element === target)
        dot.hoverAnimation?.play()
      })

      const dotMouseLeaveHandle = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        if (target === activeDot.current.element) return
        const dot = dotsRef.current.find((refs) => refs.element === target)
        dot.hoverAnimation?.reverse()
      })

      const dotClickHandle = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const newActiveDot = dotsRef.current.find(
          (refs) => refs.element === target,
        )
        const newActiveDotIndex = dotsRef.current.indexOf(newActiveDot)
        const currentActiveDotIndex = dotsRef.current.indexOf(activeDot.current)

        if (newActiveDotIndex === currentActiveDotIndex) return

        rotateCircleAnimation(newActiveDot, newActiveDotIndex)
        changeProgress(newActiveDotIndex)
      })

      dotsRef.current = gsap.utils.toArray<HTMLElement>(".dot").map((el) => {
        return {
          element: el,
          hoverAnimation: openDotAnimation(el),
          activeAnimation: activeDotAnimation(el),
        }
      })

      dotsRef.current.forEach((doteRef, index) => {
        if (index === 0) activeDot.current = doteRef

        const { x, y } = getDotPosition({ index, radius })
        gsap.to(doteRef.element, {
          x,
          y,
          duration: 1,
          delay: 0.5,
          onComplete: () => {
            activeDot.current.hoverAnimation.play()
            activeDot.current.activeAnimation.play()
            doteRef.element.addEventListener("mouseenter", dotMouseEnterHandle)
            doteRef.element.addEventListener("mouseleave", dotMouseLeaveHandle)
            doteRef.element.addEventListener("click", dotClickHandle)
          },
        })
      })

      const nextButtonClickHandle = contextSafe(() => {
        const nextIndex = dotsRef.current.indexOf(activeDot.current) + 1
        const nextDot = dotsRef.current[nextIndex]
        rotateCircleAnimation(nextDot, nextIndex)
        changeProgress(nextIndex)
      })

      const prevButtonClickHandle = contextSafe(() => {
        const prevIndex = dotsRef.current.indexOf(activeDot.current) - 1
        const prevDot = dotsRef.current[prevIndex]
        rotateCircleAnimation(prevDot, prevIndex)
        changeProgress(prevIndex)
      })

      document
        .querySelector(".next")
        .addEventListener("click", nextButtonClickHandle)
      document
        .querySelector(".prev")
        .addEventListener("click", prevButtonClickHandle)
    },
    { scope: circleWrapper },
  )

  const showDots = () => {
    return dots.map((dot, index) => {
      return (
        <div id={dot.id} className={`${styles.dot} dot`} key={dot.id}>
          <span className="number">{index + 1}</span>
          <p className="name">{dot.name}</p>
        </div>
      )
    })
  }

  return (
    <div className={styles.wrapper} ref={circleWrapper}>
      <div className={`${styles.circle} circle`} ref={circle}>
        {showDots()}
      </div>

      <div className={styles.navigation}>
        <div className={styles.progress}>
          <span className={`currentDotIndex`}>01</span>
          <span>{`/0${dots.length}`}</span>
        </div>

        <div className={styles.buttons}>
          <button className={`prev`} disabled />
          <button className={`${styles.next} next`} />
        </div>
      </div>


    </div>
  )
}

export default Circle
