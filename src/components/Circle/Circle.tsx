import { Data } from "@/index"
import styles from "./Circle.module.scss"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import React, { useCallback, useRef } from "react"

gsap.registerPlugin(useGSAP)

type Props = {
  dots: Omit<Data, "content">[]
  setActive?: (id: string) => void
  setPrev?: (id: string) => void
}

type DotRef = {
  element: HTMLElement
  hoverAnimation?: gsap.core.Timeline
  activeAnimation?: gsap.core.Timeline
}

function Circle({ dots, setActive, setPrev }: Props) {
  const circle = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<DotRef[]>([])
  const clickedDotRef = useRef<DotRef>(null)

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
      while (diff > 180) diff -= 360
      while (diff < -180) diff += 360

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

      const radius = Number(gsap.getProperty(circle.current, "--diameter")) / 2

      const onMouseEnter = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const dot = dotsRef.current.find((refs) => refs.element === target)
        dot.hoverAnimation?.play()
      })

      const onMouseLeave = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        if (target === clickedDotRef.current.element) return
        const dot = dotsRef.current.find((refs) => refs.element === target)
        dot.hoverAnimation?.reverse()
      })

      const onClick = contextSafe((e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const clickedDot = dotsRef.current.find(
          (refs) => refs.element === target,
        )

        const clickedDotIndex = dotsRef.current.indexOf(clickedDot)
        const currentActiveDotIndex = dotsRef.current.indexOf(
          clickedDotRef.current,
        )

        if (clickedDotIndex === currentActiveDotIndex) {
          return
        }

        const newRotation = getCircleRotation(clickedDotIndex)

        gsap.to(circle.current, {
          rotation: newRotation,
          duration: 0.6,
        })
        gsap.to(".dot", {
          rotation: -newRotation,
          duration: 0.6,
        })

        clickedDot.activeAnimation.play()
        clickedDotRef.current.hoverAnimation.reverse()
        clickedDotRef.current.activeAnimation.reverse()
        clickedDotRef.current = clickedDot
        setActive(clickedDot.element.id)
        setPrev(clickedDotRef.current.element.id)

        const fromIndex = { val: currentActiveDotIndex }
        gsap.to(fromIndex, {
          val: clickedDotIndex,
          duration: 1,
          onUpdate: () => {
            document.querySelector(".currentDotIndex").textContent =
              `0${clickedDotIndex + 1}`
          },
        })
      })

      dotsRef.current = gsap.utils.toArray<HTMLElement>(".dot").map((el) => {
        return {
          element: el,
          hoverAnimation: openDotAnimation(el),
          activeAnimation: activeDotAnimation(el),
        }
      })

      dotsRef.current.forEach((doteRef, index) => {
        if (index === 0) clickedDotRef.current = doteRef

        const { x, y } = getDotPosition({ index, radius })
        gsap.to(doteRef.element, {
          x,
          y,
          duration: 1,
          delay: 0.5,
          onComplete: () => {
            clickedDotRef.current.hoverAnimation.play()
            clickedDotRef.current.activeAnimation.play()
            doteRef.element.addEventListener("mouseenter", onMouseEnter)
            doteRef.element.addEventListener("mouseleave", onMouseLeave)
            doteRef.element.addEventListener("click", onClick)
          },
        })
      })

      const onNextClick = contextSafe((e: MouseEvent) => {
        const nextIndex = dotsRef.current.indexOf(clickedDotRef.current) + 1
        const nextDot = dotsRef.current[nextIndex]
        const newRotation = getCircleRotation(nextIndex)

        gsap.to(circle.current, {
          rotation: newRotation,
          duration: 0.6,
        })
        gsap.to(".dot", {
          rotation: -newRotation,
          duration: 0.6,
        })

        nextDot.hoverAnimation.play()
        nextDot.activeAnimation.play()
        clickedDotRef.current.hoverAnimation.reverse()
        clickedDotRef.current.activeAnimation.reverse()
        clickedDotRef.current = nextDot
        setActive(nextDot.element.id)
        setPrev(clickedDotRef.current.element.id)

        const fromIndex = { val: nextIndex - 1 }
        gsap.to(fromIndex, {
          val: nextIndex,
          duration: 1,
          onUpdate: () => {
            document.querySelector(".currentDotIndex").textContent =
              `0${nextIndex + 1}`
          },
        })

        if (nextIndex + 1 === dotsRef.current.length) {
          const target = e.currentTarget as HTMLButtonElement
          gsap.to(target, {
            attr: {
              disabled: "true",
            },
          })
        }
      })
      const nextButton = document.querySelector(".next")
      nextButton.addEventListener("click", onNextClick)
    },
    { scope: wrapper },
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
    <div className={`wrapper`} ref={wrapper}>
      <div className={`${styles.circle} circle`} ref={circle}>
        {showDots()}
      </div>
      <div>
        <div>
          <span className={`currentDotIndex`}>01</span>
          <span>{`/0${dots.length}`}</span>
        </div>
        <div>
          <button className={`prev`}>Prev</button>
          <button className={`next`}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default Circle
