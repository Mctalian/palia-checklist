import { getWeeklyWantsFromTemplate } from "./gifts";

describe("getWeeklyWantsFromTemplate", () => {
  test("handles multiple lines", () => {
    const text = `{{WeeklyWants
      |Test1
      |Test2
      |Test3
      |Test4
    }}`

    const actual = getWeeklyWantsFromTemplate(text);
    expect(actual[0]).toBe("Test1")
    expect(actual[1]).toBe("Test2")
    expect(actual[2]).toBe("Test3")
    expect(actual[3]).toBe("Test4")
  });

  test("handles blank lines", () => {
    const text = `{{WeeklyWants
      |Test1
      |
      |Test3
      |
    }}`

    const actual = getWeeklyWantsFromTemplate(text);
    expect(actual[0]).toBe("Test1")
    expect(actual[1]).toBe("")
    expect(actual[2]).toBe("Test3")
    expect(actual[3]).toBe("")
  })
});