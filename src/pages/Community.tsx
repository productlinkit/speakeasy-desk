import { useMemo, useRef, useState, type FormEvent } from 'react'
import { TopBar } from '../components/TopBar'
import { posts as seedPosts, type Comment, type Post } from '../data/community'
import { user } from '../data/home'
import './Community.css'

export type CommunityStep = 'feed' | 'new'

type Draft = { title: string; body: string; images: string[] }

const emptyDraft: Draft = { title: '', body: '', images: [] }

/* ---------------------------------------------------------------- card ---- */

function Avatar({ initial, tone, size }: { initial: string; tone: string; size?: 'sm' }) {
  return (
    <span className={`avatar${size === 'sm' ? ' avatar--sm' : ''}`} style={{ background: tone }} aria-hidden>
      {initial}
    </span>
  )
}

function PostCard({ post, onReply }: { post: Post; onReply: (id: number, text: string) => void }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [slide, setSlide] = useState(0)
  const [reply, setReply] = useState('')

  const long = post.content.length > 170
  const body = long && !expanded ? `${post.content.slice(0, 170).trimEnd()}…` : post.content

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = reply.trim()
    if (!text) return
    onReply(post.id, text)
    setReply('')
  }

  return (
    <article className="post">
      <header className="post__head">
        <Avatar initial={post.initial} tone={post.tone} />
        <p className="post__author">{post.author}</p>
      </header>

      <h2 className="post__title">{post.title}</h2>
      <p className="post__body">{body}</p>
      {long && (
        <button type="button" className="post__more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {post.images.length > 0 && (
        <figure className="shots">
          <img src={post.images[slide]} alt="" className="shots__img" />
          {post.images.length > 1 && (
            <>
              <span className="shots__count">
                {slide + 1}/{post.images.length}
              </span>
              <button
                type="button"
                className="shots__nav shots__nav--prev"
                onClick={() => setSlide((i) => (i === 0 ? post.images.length - 1 : i - 1))}
                aria-label="Previous image"
              >
                <Caret dir="left" />
              </button>
              <button
                type="button"
                className="shots__nav shots__nav--next"
                onClick={() => setSlide((i) => (i + 1) % post.images.length)}
                aria-label="Next image"
              >
                <Caret dir="right" />
              </button>
              <span className="shots__dots">
                {post.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`shots__dot${i === slide ? ' is-on' : ''}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Image ${i + 1}`}
                    aria-current={i === slide}
                  />
                ))}
              </span>
            </>
          )}
        </figure>
      )}

      <footer className="post__foot">
        <button
          type="button"
          className={`post__comments${open ? ' is-on' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <CommentIcon filled={open} /> {post.comments.length}
        </button>
        <span className="post__when">{post.when}</span>
      </footer>

      {open && (
        <div className="thread">
          {post.comments.length === 0 ? (
            <p className="thread__empty">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <ul className="thread__list">
              {post.comments.map((c) => (
                <li key={c.id} className="thread__item">
                  <Avatar initial={c.initial} tone={c.tone} size="sm" />
                  <div>
                    <p className="thread__who">
                      {c.author} <span>{c.when}</span>
                    </p>
                    <p className="thread__text">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form className="thread__bar" onSubmit={send}>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Your reply"
              aria-label={`Reply to ${post.title}`}
            />
            <button type="submit" className="thread__send" disabled={!reply.trim()} aria-label="Send reply">
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </article>
  )
}

/* ---------------------------------------------------------------- feed ---- */

function Feed({
  list,
  onNewPost,
  onReply,
}: {
  list: Post[]
  onNewPost: () => void
  onReply: (id: number, text: string) => void
}) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'feed' | 'post'>('feed')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = tab === 'post' ? list.filter((p) => p.mine) : list
    if (!q) return base
    return base.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
    )
  }, [list, query, tab])

  return (
    <div className="community">
      <TopBar />

      <div className="csearch">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          aria-label="Search posts"
        />
        {query && (
          <button type="button" className="csearch__clear" onClick={() => setQuery('')} aria-label="Clear">
            ✕
          </button>
        )}
        <span className="csearch__icon" aria-hidden>
          <SearchIcon />
        </span>
      </div>

      <button type="button" className="btn community__new" onClick={onNewPost}>
        <CommentIcon filled /> New Post
      </button>

      <div className="ctabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'feed'}
          className={`ctabs__tab${tab === 'feed' ? ' is-on' : ''}`}
          onClick={() => setTab('feed')}
        >
          Feed
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'post'}
          className={`ctabs__tab${tab === 'post' ? ' is-on' : ''}`}
          onClick={() => setTab('post')}
        >
          Post
        </button>
      </div>

      <div className="community__list">
        {shown.map((post) => (
          <PostCard key={post.id} post={post} onReply={onReply} />
        ))}
        {shown.length === 0 && (
          <p className="community__empty">
            {query ? `No post matches “${query}”.` : 'You have not written a post yet.'}
          </p>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ new post ---- */

function NewPost({
  draft,
  setDraft,
  onBack,
  onPublish,
}: {
  draft: Draft
  setDraft: (d: Draft) => void
  onBack: () => void
  onPublish: () => void
}) {
  const picker = useRef<HTMLInputElement>(null)
  const ready = draft.title.trim().length > 0 || draft.body.trim().length > 0

  const addImages = (files: FileList | null) => {
    if (!files?.length) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    setDraft({ ...draft, images: [...draft.images, ...urls] })
  }

  const drop = (url: string) => {
    URL.revokeObjectURL(url)
    setDraft({ ...draft, images: draft.images.filter((u) => u !== url) })
  }

  return (
    <div className="newpost">
      <header className="newpost__head">
        <button type="button" className="newpost__back" onClick={onBack} aria-label="Back">
          <BackArrow />
        </button>
        <h1>New Post</h1>
        <button type="button" className="btn newpost__send" onClick={onPublish} disabled={!ready}>
          Posting
        </button>
      </header>

      <input
        className="newpost__title"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        placeholder="Title"
        aria-label="Title"
      />
      <textarea
        className="newpost__body"
        value={draft.body}
        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        placeholder="Enter a message ..."
        aria-label="Message"
      />

      {draft.images.length > 0 && (
        <ul className="newpost__shots">
          {draft.images.map((url) => (
            <li key={url}>
              <img src={url} alt="" />
              <button type="button" onClick={() => drop(url)} aria-label="Remove image">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="newpost__add" onClick={() => picker.current?.click()}>
        <ImageIcon />
        Add Images
      </button>
      <input
        ref={picker}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          addImages(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */

export function Community({
  step,
  onNavigate,
}: {
  step: CommunityStep
  onNavigate: (to: string) => void
}) {
  const [list, setList] = useState<Post[]>(seedPosts)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const nextId = useRef(1000)

  const reply = (id: number, text: string) => {
    const comment: Comment = {
      id: nextId.current++,
      author: user.name,
      initial: user.initial,
      tone: '#f97316',
      text,
      when: 'now',
    }
    setList((all) =>
      all.map((p) => (p.id === id ? { ...p, comments: [...p.comments, comment] } : p)),
    )
  }

  const publish = () => {
    const post: Post = {
      id: nextId.current++,
      author: user.name,
      initial: user.initial,
      tone: '#f97316',
      title: draft.title.trim() || 'Untitled',
      content: draft.body.trim(),
      images: draft.images,
      comments: [],
      when: 'now',
      mine: true,
    }
    setList((all) => [post, ...all])
    setDraft(emptyDraft)
    onNavigate('/community')
  }

  if (step === 'new') {
    return (
      <NewPost
        draft={draft}
        setDraft={setDraft}
        onBack={() => onNavigate('/community')}
        onPublish={publish}
      />
    )
  }

  return <Feed list={list} onNewPost={() => onNavigate('/community/new-post')} onReply={reply} />
}

/* --------------------------------------------------------------- bits ---- */

function BackArrow() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CommentIcon({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.4 20.4 21 12 3.4 3.6 3.39 10.1 15.5 12 3.39 13.9z" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5 17 4.5-5 3.5 3.5L16 13l3 4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="9" cy="9.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

function Caret({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
