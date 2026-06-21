import { redirect } from "next/navigation";
import HomePage from "@/app/page";
import { getOptionalUser } from "@/lib/supabase/auth";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/supabase/auth", () => ({
  getOptionalUser: vi.fn(),
}));

describe("HomePage", () => {
  it("redirects signed-in users to the dashboard", async () => {
    vi.mocked(getOptionalUser).mockResolvedValue({ id: "user_123" } as Awaited<
      ReturnType<typeof getOptionalUser>
    >);

    await expect(async () => {
      await HomePage();
    }).rejects.toThrow("REDIRECT:/dashboard");
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
