import { render, screen } from "@testing-library/react";
import { CaseStudyPage } from "@/components/case-study/case-study-page";

describe("CaseStudyPage", () => {
  it("frames the project as a procurement analyst case study with RFQ risk analysis", () => {
    render(<CaseStudyPage />);

    expect(
      screen.getByRole("heading", {
        name: /from quote chaos to sourcing clarity/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/before: manual and disconnected/i)).toBeInTheDocument();
    expect(screen.getByText(/after: standardized and visible/i)).toBeInTheDocument();
    expect(screen.getByText(/^lead-time risk$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^moq exposure$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/42% faster sourcing cycle/i)).toBeInTheDocument();
  });
});
