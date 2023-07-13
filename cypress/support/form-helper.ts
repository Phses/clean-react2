export const testaInputStatus = (fieldName: string, erro?: string) => {
  const attr = erro ? 'have.attr' : 'not.have.attr'
  const text = erro ? '❌' : '✅'
  cy.getByTestId(`${fieldName}-status`).should(attr, 'title', erro).should('have.text', text)
}