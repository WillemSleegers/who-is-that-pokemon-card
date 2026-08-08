import { describe, expect, it } from "vitest"
import { ART_BOX } from "./artCrop"

describe("ART_BOX", () => {
  it("matches the specified source rectangle", () => {
    expect(ART_BOX).toEqual({ sx: 133, sy: 118, sWidth: 472, sHeight: 364 })
  })
})
