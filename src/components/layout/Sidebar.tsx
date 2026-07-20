"use client"

import Image from "next/image"
import { ChevronDown, Mail, MapPin } from "lucide-react"
import { profile } from "@/data/portfolio"
import { IconBox } from "@/components/ui/IconBox"
import { Separator } from "@/components/ui/Separator"
import { useSidebarToggle } from "@/hooks/useSidebarToggle"
import { cn } from "@/lib/cn"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.374 6.231H2.77l7.723-8.835L1.254 2.25H8.08l4.251 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

export const Sidebar = () => {
  const { isExpanded, handleToggle, label } = useSidebarToggle()

  return (
    <aside
      className={cn(
        "relative z-[1] mb-4 overflow-hidden rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] transition-[max-height] duration-500 ease-in-out max-[579px]:max-h-[112px] min-[580px]:mx-auto min-[580px]:mb-8 min-[580px]:w-[520px] min-[580px]:max-h-[180px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:sticky min-[1250px]:top-[60px] min-[1250px]:mb-0 min-[1250px]:h-full min-[1250px]:w-auto min-[1250px]:max-h-max min-[1250px]:pt-[60px]",
        isExpanded &&
          "max-[579px]:max-h-[600px] min-[580px]:max-h-[584px] min-[1250px]:max-h-max"
      )}
      data-sidebar
    >
      <div className="relative flex items-center justify-start gap-4 min-[580px]:gap-6 min-[1250px]:flex-col">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3d3d40] to-[#303030] min-[580px]:h-[120px] min-[580px]:w-[120px] min-[580px]:rounded-[30px] min-[1250px]:h-[150px] min-[1250px]:w-[150px]">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={150}
            height={150}
            className="h-full w-full object-cover object-top"
            priority
          />
        </div>

        <div className="min-[1250px]:text-center">
          <h1 className="mb-2.5 text-[17px] font-medium tracking-[-0.25px] text-white-2 min-[580px]:mb-[15px] min-[580px]:whitespace-nowrap min-[580px]:text-[26px]">
            {profile.name}
          </h1>
          <p className="w-max rounded-lg bg-onyx px-3 py-[3px] text-[11px] font-light text-white-1 min-[580px]:px-[18px] min-[580px]:py-[5px] min-[580px]:text-xs min-[1250px]:mx-auto">
            {profile.title}
          </p>
        </div>

        <button
          type="button"
          className="absolute top-[-15px] right-[-15px] z-[1] rounded-tr-[15px] rounded-bl-[15px] bg-gradient-to-br from-[#38383d] to-transparent p-2.5 text-[13px] text-gold shadow-[var(--shadow-2)] transition-colors duration-250 before:absolute before:inset-px before:-z-[1] before:rounded-[inherit] before:bg-[linear-gradient(to_bottom_right,hsla(240,1%,18%,0.251),hsla(240,2%,11%,0)),#222226] before:transition-colors hover:bg-gradient-to-br hover:from-[#ffdb70] hover:to-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-[580px]:top-[-30px] min-[580px]:right-[-30px] min-[580px]:px-[15px] min-[580px]:py-2.5 min-[1250px]:hidden"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls="sidebar-contacts"
          aria-label={label}
        >
          <span className="hidden min-[580px]:inline">{label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-250 min-[580px]:ml-1 min-[580px]:inline",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id="sidebar-contacts"
        className={cn(
          "transition-all duration-500 ease-in-out",
          isExpanded
            ? "visible opacity-100"
            : "invisible opacity-0 min-[1250px]:visible min-[1250px]:opacity-100"
        )}
      >
        <Separator />

        <ul className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2 min-[768px]:gap-x-4 min-[768px]:gap-y-[30px] min-[1250px]:grid-cols-1">
          <li className="flex min-w-full items-center gap-4">
            <IconBox>
              <Mail className="h-4 w-4" />
            </IconBox>
            <div className="w-[calc(100%-46px)] max-w-[calc(100%-46px)]">
              <p className="mb-0.5 text-[11px] uppercase text-light-gray-70">
                Email
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="block truncate text-[13px] text-white-2 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-[580px]:text-[15px] min-[1250px]:text-sm min-[1250px]:font-light"
                tabIndex={0}
                aria-label={`Email ${profile.email}`}
              >
                {profile.email}
              </a>
            </div>
          </li>

          <li className="flex min-w-full items-center gap-4">
            <IconBox>
              <MapPin className="h-4 w-4" />
            </IconBox>
            <div className="w-[calc(100%-46px)] max-w-[calc(100%-46px)]">
              <p className="mb-0.5 text-[11px] uppercase text-light-gray-70">
                Location
              </p>
              <address className="text-[13px] not-italic text-white-2 min-[580px]:text-[15px] min-[1250px]:text-sm min-[1250px]:font-light">
                {profile.location}
              </address>
            </div>
          </li>
        </ul>

        <Separator className="min-[1250px]:opacity-0" />

        <ul className="flex items-center justify-start gap-4 pb-1 pl-1.5 min-[1250px]:justify-center">
          <li>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-light-gray-70 transition-colors hover:text-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="GitHub profile"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          </li>
          <li>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-light-gray-70 transition-colors hover:text-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </li>
          <li>
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg text-light-gray-70 transition-colors hover:text-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="X (Twitter) profile"
            >
              <XIcon className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
