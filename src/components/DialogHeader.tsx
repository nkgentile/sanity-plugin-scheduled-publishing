import React from 'react'
import TimeZoneButton from './TimeZoneButton'
import {Box, Flex} from '@sanity/ui'

interface Props {
  title: string
}

const DialogHeader = (props: Props) => {
  const {title} = props
  return (
    <Flex align="center">
      {title}
      <Box
        style={{
          position: 'absolute',
          right: '-1.25em', // TODO: bit cheeky, consider alternative
        }}
      >
        <TimeZoneButton />
      </Box>
    </Flex>
  )
}

export default DialogHeader
