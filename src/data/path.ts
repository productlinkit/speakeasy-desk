// The home screen is a learning path: every course from My Learning becomes a
// unit, and the lessons inside it become the nodes you walk down.
import { doneCourses, level, ongoingCourses, type Course } from './learning'

export type Tone = 'blue' | 'violet' | 'purple' | 'navy'
export type NodeKind = 'lesson' | 'practice' | 'chest' | 'trophy'
export type NodeState = 'done' | 'active' | 'locked'

export type PathNode = {
  id: string
  kind: NodeKind
  state: NodeState
  /** read out by screen readers and shown in the popover */
  label: string
}

export type Unit = {
  id: string
  /** the number printed in the unit bar */
  index: number
  title: string
  blurb: string
  image: string
  progress: number
  tone: Tone
  nodes: PathNode[]
}

const tones: Tone[] = ['blue', 'violet', 'purple', 'navy']

/** every unit walks the same seven stops, like the app's lesson plan */
const shape: { kind: NodeKind; label: string }[] = [
  { kind: 'lesson', label: 'Lesson 1' },
  { kind: 'lesson', label: 'Lesson 2' },
  { kind: 'practice', label: 'Practice' },
  { kind: 'chest', label: 'Reward chest' },
  { kind: 'lesson', label: 'Lesson 3' },
  { kind: 'lesson', label: 'Lesson 4' },
  { kind: 'trophy', label: 'Unit test' },
]

/** the three most recent finished courses, then everything still in progress */
const recent = 3
const source: Course[] = [...doneCourses.slice(-recent), ...ongoingCourses]

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function build(): Unit[] {
  // only the first unfinished course gets an active node — the rest stay shut
  let opened = false

  return source.map((course, i) => {
    const id = slug(course.title)
    const finished = course.progress === 100
    const cleared = finished ? shape.length : opened ? -1 : Math.round((course.progress / 100) * shape.length)
    if (!finished && !opened) opened = true

    return {
      id,
      index: doneCourses.length - recent + i + 1,
      title: course.title,
      blurb: course.description,
      image: course.image,
      progress: course.progress,
      tone: tones[i % tones.length],
      nodes: shape.map((node, n) => ({
        id: `${id}-${n}`,
        kind: node.kind,
        label: node.label,
        state: n < cleared ? 'done' : n === cleared ? 'active' : 'locked',
      })),
    }
  })
}

export const units = build()

export const activeNode = units.flatMap((unit) => unit.nodes).find((node) => node.state === 'active')
export const activeUnit = units.find((unit) => unit.nodes.some((node) => node.state === 'active'))

/** "Intermediate 3" — printed above the unit title, like the section label in the app */
export const section = level.name
