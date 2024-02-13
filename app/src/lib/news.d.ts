import type { CountryName, CountryFlag } from "./countries.js";

enum NewsSourceType {
    FEED_RSS = "RSS",
    FEED_ATOM = "Atom",
    FEED_JSON = "JSON",
    FEED_YTRSS = "YouTube",
    FEED_TG = "Telegram"
};

enum NewsSourceScore {
    FACTUALITY_VERY_HIGH = "Very high factuality",
    FACTUALITY_HIGH = "High factuality",
    FACTUALITY_FAIR = "Fair factuality",
    FACTUALITY_DISPUTED = "Disputed factuality",
    FACTUALITY_LOW = "Low factuality",
    FACTUALITY_NONE = "Unreliable factuality"
};

enum NewsSourceMediaType {
    INDEPENDENT_MEDIA = "Independent media outlet",
    AFFILIATED_MEDIA = "Affiliated media outlet",
    MURDOCH_MEDIA = "Media outlet owned in whole or in part by News Corp",
    GOV_MEDIA = "Media outlet owned in whole or in part by a national government",
    GOV_MEDIA2 = "Media outlet funded in whole or in part by a national government"
}

type _validCrawlType = {
    [NewsSourceType.FEED_RSS]: true | false,
    [NewsSourceType.FEED_ATOM]: true | false,
    [NewsSourceType.FEED_JSON]: true | false,
    [NewsSourceType.FEED_YTRSS]: false,
    [NewsSourceType.FEED_TG]: false
};
  
type NewsSource = {
    id: string,
    name: string,
    feedType: NewsSourceType,
    feedUrl: string,
    crawl: _validCrawlType[NewsSource["feedType"]],
    crawlOpts?: {
        openGraph: boolean,
        content: boolean,
        contentOpts: {
            stripHtml: boolean,
            xpaths: string[]
        }
    }
    aiSummary: boolean,
    aiSummaryOpts?: {
        maxContentLen: number,
        openAi: {
            assistantId: string
        }
    },
    reputation?: {
        score: NewsSourceScore,
        authorship: {
            countryFlag: CountryFlag,
            country: CountryName,
            media: NewsSourceMediaType,
            notes?: string
        }
    }
};

type NewsGuildConfig = {
    enabled: boolean,
    channel_id: string,
    override?: {
        crawl?: boolean,
        aiSummary?: boolean
    }
    sources: NewsSource[]
};

type NewsConfig = {
    enabled: boolean,
    override?: {
        crawl?: boolean,
        aiSummary?: boolean
    }
    guilds: {
        [id: string]: NewsGuildConfig
    }
};

export type { NewsSource, NewsSourceMediaType, NewsSourceScore, NewsSourceType, NewsGuildConfig, NewsConfig };