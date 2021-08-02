declare module 'flippy.js' {
  type Elements = Element|Array<Element>|String
  interface Options {
    callback: (elms: Elements) => any
    duration: number
    ease: string
    animatingClass: string
    scalingClass: string
  }
  interface FLIPOptions extends Options {
    useScale: boolean
    debug: boolean
  }
  export class FLIPElement {
    constructor(elm: HTMLElement, options: FLIPOptions)
    opts: FLIPElement
    setOptions(options: FLIPElement): void
    first(): FLIPElement
    last(): FLIPElement
    invert(): FLIPElement
    play(): FLIPElement
    stop(): FLIPElement
    clean(): FLIPElement
    finish(): FLIPElement
    debug(): FLIPElement
  }

  export default function (elms: Elements, modifier: () => void, options?: Options): Promise<Array<Element>>
}
