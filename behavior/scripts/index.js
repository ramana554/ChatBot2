'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })
  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
	  greeting: 'greeting'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
	  greeting: handleGreeting,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
