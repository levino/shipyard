import { Deck, Slide, Heading, DefaultTemplate, Text } from 'spectacle'
import React from 'react'
import ProConTable from './_proConTable.md'
import UsageOfMailingList from './_usageOfMailingList.md'

const Presentation = () => (
  <Deck template={<DefaultTemplate />}>
    <Slide>
      <Heading>Kommunikationsplattform</Heading>
      <Text>Wie wollen wir miteinander kommunizieren?</Text>
    </Slide>
    <Slide>
      <ProConTable />
    </Slide>
    <Slide>
      <Heading>Nutzung</Heading>
      <UsageOfMailingList />
    </Slide>
  </Deck>
)

export default Presentation
