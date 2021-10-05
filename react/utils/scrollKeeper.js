class ScrollKeeper {
  constructor() {
    this.pages = {
      orders: {
        x: 0,
        y: 0,
      },
      edit: {
        x: 0,
        y: 0,
      },
      cancel: {
        x: 0,
        y: 0,
      },
    }
  }

  savePagePositions(name) {
    const positions = {
      x: window.scrollX,
      y: window.scrollY,
    }

    this.pages[name] = positions
  }

  restorePagePositions(name) {
    const page = this.pages[name]
    window.scrollTo(page.x, page.y)

    return page
  }
}

const scrollKeeper = new ScrollKeeper()

export default scrollKeeper
