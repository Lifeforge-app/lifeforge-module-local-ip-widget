import { useQuery } from '@tanstack/react-query'
import tinycolor from 'tinycolor2'

import type { WidgetConfig } from '@lifeforge/configs'
import {
  Box,
  Card,
  Flex,
  Icon,
  Scrollbar,
  Text,
  WithQuery,
  colorWithOpacity,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export default function Quotes() {
  const quoteQuery = useQuery(forgeAPI.quotes.random.queryOptions())
  const { derivedThemeColor: themeColor } = usePersonalization()

  return (
    <Card
      centered
      bg="primary"
      gap="sm"
      height="100%"
      position="relative"
      style={{
        isolation: 'isolate'
      }}
    >
      <Box asChild position="absolute" right="1em" top="1em" zIndex="-1">
        <Icon
          color={colorWithOpacity('bg-800', '10%')}
          icon="tabler:quote"
          size="6em"
        />
      </Box>
      <Box
        asChild
        bottom="1em"
        left="1em"
        position="absolute"
        style={{
          transform: 'rotate(180deg)'
        }}
        zIndex="-1"
      >
        <Icon
          color={colorWithOpacity('bg-800', '10%')}
          icon="tabler:quote"
          size="6em"
        />
      </Box>
      <Scrollbar>
        <WithQuery query={quoteQuery} showRetryButton={false}>
          {quote => (
            <Flex
              align="center"
              direction="column"
              height="100%"
              justify="center"
            >
              <Text
                align="center"
                as="p"
                color={tinycolor(themeColor).isLight() ? 'bg-800' : 'bg-100'}
                size={{ base: 'lg', sm: 'xl' }}
              >
                {quote.length ? (
                  <>
                    {quote[0]!.q}
                    <Text
                      as="div"
                      color={colorWithOpacity('bg-800', '50%')}
                      mt="md"
                      size="base"
                      weight="medium"
                    >
                      - {quote[0]!.a}
                    </Text>
                    <Text
                      as="a"
                      color="muted"
                      display="block"
                      href={quote[0]!.url}
                      mt="sm"
                      rel="noreferrer"
                      size="xs"
                      target="_blank"
                    >
                      QuotesCharm
                    </Text>
                  </>
                ) : (
                  <Text align="center">No quote for today :(</Text>
                )}
              </Text>
            </Flex>
          )}
        </WithQuery>
      </Scrollbar>
    </Card>
  )
}

export const config: WidgetConfig = {
  id: 'quotes',
  icon: 'tabler:quote',
  minH: 2,
  minW: 2
}
