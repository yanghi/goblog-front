
export enum PostStatu {
  Public = 0,
  Private,
  Draft
}
const postStatuTextMap: Record<PostStatu, string> = {
  [PostStatu.Draft]: "草稿",
  [PostStatu.Public]: "公开",
  [PostStatu.Private]: "私有"
}
export function getPostStatuText(s: PostStatu): string {
  return postStatuTextMap[s]
}

export function getPostStatuOptions() {
  return Object.keys(postStatuTextMap).map((k: any) => ({
    label: postStatuTextMap[k as PostStatu],
    value: PostStatu[PostStatu[k] as any] as any as PostStatu
  }))
}

export const PostStatuOptions = getPostStatuOptions()