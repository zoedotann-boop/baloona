import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Container } from "./container"

import { Section } from "./section"

const meta = {
  title: "Layout/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
  args: {
    className: "bg-white",
    children: (
      <Container className="text-center text-brand-plum">
        פס עמוד עם מרווח אנכי ומרווח צד אחידים
      </Container>
    ),
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = { args: { spacing: "lg" } }
export const Medium: Story = { args: { spacing: "md" } }
export const ExtraLarge: Story = { args: { spacing: "xl" } }
