import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { SearchIcon, SparklesIcon } from "lucide-react"

import { quickSearchSchema, type QuickSearchValues } from "../schemas"

const suggestedTags = ["Lập trình Python", "Marketing", "Tâm lý học", "Sapiens", "Kinh tế học"]

export const HeroBanner = () => {
  const form = useForm<QuickSearchValues>({
    resolver: zodResolver(quickSearchSchema),
    defaultValues: {
      searchValue: ""
    }
  })

  const onSubmit = (values: QuickSearchValues) => {
    console.info("Values: ", values)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-50 via-blue-50 to-blue-100/60">
      {/* Background Image */}
      <div className="absolute inset-y-0 right-0 hidden w-full sm:block lg:w-[56%]">
        <img
          src="/images/hero-banner.png"
          alt="Không gian thư viện"
          className="h-full w-full object-cover"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 95%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 95%)"
          }}
        />
      </div>
      <div className="relative z-10 grid grid-cols-1 gap-6 px-8 py-10 sm:px-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            Chào mừng bạn trở lại! 👋
          </h1>
          <p className="mb-6 max-w-md leading-relaxed text-slate-500">
            Tri thức là chìa khóa mở ra mọi cánh cửa. Tìm sách, mượn sách và khám phá thế giới tri
            thức ngay hôm nay!
          </p>
          <form
            id="form-quick-search"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-4 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 pl-5 shadow-sm"
          >
            <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
            <Controller
              control={form.control}
              name="searchValue"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  spellCheck="false"
                  autoComplete="off"
                  disabled={false}
                  placeholder="Bạn muốn tìm sách gì hôm nay?"
                  className="placeholder-muted-foretext-muted-foreground min-w-0 flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              )}
            />
            <SparklesIcon className="size-5 shrink-0 text-blue-400" />
            <button
              type="submit"
              form="form-quick-search"
              className="shrink-0 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600/90 sm:px-6"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 text-muted-foreground">Từ khóa gợi ý:</span>
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => form.setValue("searchValue", tag)}
                className="rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-[13px] font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-6 right-6 z-20 hidden max-w-60 items-center gap-3 rounded-2xl bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur lg:flex">
        <SparklesIcon className="size-5 shrink-0 text-blue-500" />
        <div className="leading-snug">
          <p className="text-[13px] font-semibold text-foreground">Tìm kiếm thông minh</p>
          <p className="text-xs text-muted-foreground">
            Hỗ trợ tìm sách bằng ngôn ngữ tự nhiên{" "}
            <span className="font-semibold text-blue-500">(AI)</span>
          </p>
        </div>
      </div>
    </section>
  )
}
