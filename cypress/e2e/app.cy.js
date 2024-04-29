import assert from 'assert'

class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit')
  }
  typeTitle(text) {
    if (!text) return;
    this.elements.titleInput().type(text)
  }
  typeUrl(text) {
    if (!text) return;
    this.elements.imageUrlInput().type(text)
  }
  clickSubmit() {
    this.elements.submitBtn().click()
  }
}
const registerForm = new RegisterForm()
const colors = {
  errors: 'rgb(220, 53, 69)',
  success: 'rgb(25, 135, 84)'
}

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: '',
      url: ''
    }
    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })
    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })
    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })
    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      // registerForm.elements.titleFeedback().should(element => {
      //  debugger
      // })
      registerForm.elements.titleFeedback().should('contains.text', 'Please type a title for the image')
    })
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contains.text', 'Please type a valid URL')
    })
    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.errors)
      })
    })
  })

  describe('Submitting an image with valid inputs using enter key', () => {

    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }
    it(`Given I am on the image registration page`, () => {
      cy.visit(`/`)
      cy.get('#btnSubmit').type('{enter}')
      cy.wait(100)
    })
    it(`Given I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I should see a check icon in the title field`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })
    it(`When I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })
    it(`Then I should see a check icon in the imageUrl field`, () => {
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })
    it(`Then I can hit enter to submit the form`, () => {
      cy.get('#btnSubmit').type('{enter}')
      cy.wait(100)
    })
    it(`And the list of registered images should be updated with the new item`, () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1]
        const srcLastElement = lastElement.getAttribute('src')
        assert.strictEqual(srcLastElement, input.url)
      })
    })
    it(`And the new item should be stored in the localStorage`, () => {
      console.log(cy.getAllLocalStorage())//.should('contains','image of Alien BR')
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: input.title,
          imageUrl: input.url,
        })
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })

  })

  describe(`Submitting an image and updating the list`, () => {

    after(() => {
      cy.clearAllLocalStorage()
    })
    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }
    it(`Given I am on the image registration page`, () => {
      cy.visit(`/`)
      cy.get('#btnSubmit').type('{enter}')
    })
    it(`Then I have entered "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I have entered "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })
    it(`When I click the submit button`, () => {
      cy.get('#btnSubmit').click()
      cy.wait(100)
    })
    it(`And the list of registered images should be updated with the new item`, () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1]
        const srcLastElement = lastElement.getAttribute('src')
        assert.strictEqual(srcLastElement, input.url)
      })
    })
    it(`And the new item should be stored in the localStorage`, () => {
      console.log(cy.getAllLocalStorage())//.should('contains','image of Alien BR')
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: input.title,
          imageUrl: input.url,
        })
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })

  })

  describe(`Refreshing the page after submitting an image clicking in the submit button`, () => {

    after(() => {
      cy.clearAllLocalStorage()
    })
    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }
    it(`Given I am on the image registration page`, () => {
      cy.visit(`/`)
    })
    it(`Then I have submitted an image by clicking the submit button`, () => {
      registerForm.typeTitle(input.title)
      registerForm.typeUrl(input.url)
      registerForm.clickSubmit()
      cy.wait(100)
    })
    it(`When I refresh the page`, () => {
      cy.reload()
    })
    it(`Then I should still see the submitted image in the list of registered images`, () => {
      console.log(cy.getAllLocalStorage())
      cy.getAllLocalStorage().should((localStorage) => {
        const currentLs = localStorage[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]

        assert.deepStrictEqual(lastElement, {
          title: input.title,
          imageUrl: input.url,
        })
      })
    })
  })
  describe(`Submitting two images and updating the list`, () => {

    after(() => {
      cy.clearAllLocalStorage()
    })
    const input = {
      title: 'Alien BR',
      title1: 'Alien Love',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg',
      url1: 'https://media.istockphoto.com/id/1397345519/photo/friendly-alien-making-a-heart-hand-gesture.jpg?s=612x612&w=0&k=20&c=YavCMfkffjkT7_briAx157ChNcGpffaqqJF_03-4E8s='
    }
    it(`Given I am on the image registration page`, () => {
      cy.visit(`/`)
      cy.get('#btnSubmit').type('{enter}')
    })
    it(`Then I have entered "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I have entered "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })
    it(`When I click the submit button`, () => {
      cy.get('#btnSubmit').click()
      cy.wait(100)
    })
    it(`Then I have entered "${input.title1}" in the title field`, () => {
      registerForm.typeTitle(input.title1)
    })
    it(`Then I have entered "${input.url1}" in the URL field`, () => {
      registerForm.typeUrl(input.url1)
    })
    it(`When I click the submit button`, () => {
      cy.get('#btnSubmit').click()
      cy.wait(400)
    })
    it(`And the list of registered images should be updated with the new items`, () => {
      cy.get('#card-list .card-img').should((elements) => {
        const lastElement = elements[elements.length - 1]
        const lastButOneElement = elements[elements.length - 2]
        const srcLastElement = lastElement.getAttribute('src')
        const srcLastButOneElement = lastButOneElement.getAttribute('src')

        assert.equal(srcLastElement, input.url1)
        assert.equal(srcLastButOneElement, input.url)
      })
    })
    it(`And the new item should be stored in the localStorage`, () => {
      console.log(cy.getAllLocalStorage())//.should('contains','image of Alien BR')
      cy.getAllLocalStorage().should((ls) => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]
        const lastButOneElement = elements[elements.length - 2]

        assert.deepStrictEqual(lastElement, {
          title: input.title1,
          imageUrl: input.url1,
        })
        assert.deepStrictEqual(lastButOneElement, {
          title: input.title,
          imageUrl: input.url,
        })
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })

  })

})
