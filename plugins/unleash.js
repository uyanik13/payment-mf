import Vue from 'vue'
import VueUnleash from 'vue-unleash'

export default ({ store }) => {
  /**
   * The <unleash-feature /> component is registered
   * globally during installation.
   */
  Vue.use(VueUnleash, {
    // Optional, name of app
    appName: 'MyVueApp',
    // Required, Unleash instance host
    host: 'https://marketplace-feature-flag.modanisa.com',
    // Required
    store,
    // Optional, providers to handle strategy logic
    strategyProviders: {
      /**
       * Example strategy provider
       *
       * @param {object} parameters Strategy parameters object from Unleash API
       * @return {boolean} If enabled or not
       */
      environmentBased(parameters) {
        const { environments } = parameters
        return environments.split(',').includes(process.env.env)
      },
      userId(parameters) {
        const { environments, userIds, isEnabledToAllUsers } = parameters
        if (isEnabledToAllUsers === 'true') {
          return true
        }

        const isEnvironmentMatch = environments
          .split(',')
          .includes(process.env.env)
        if (!isEnvironmentMatch) {
          // eslint-disable-next-line no-console
          console.log('Env mismatch')
          return false
        }

        const isUserIDMatch = userIds
          .split(',')
          .includes(store.state.customerId.toString())
        if (!isUserIDMatch) {
          return false
        }

        return true
      },
    },
  })
}
