const { Buffer } = require('safe-buffer')
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
// import 'core-js'
import { inspect } from 'util'
import 'fastestsmallesttextencoderdecoder'
import axios from 'axios'
import { SigningRequest } from 'eosio-signing-request'

const { TextEncoder, TextDecoder } = require('fastestsmallesttextencoderdecoder')

global.Buffer = Buffer

export const getEsrOptions = (url: string) => {
  console.log('getting ESR options')
  return {
    // string encoder
    textEncoder: TextEncoder,
    // string decoder
    textDecoder: TextDecoder,
    // zlib string compression (optional, recommended)
    // Customizable ABI Provider used to retrieve contract data
    abiProvider: {
      getAbi: async account => {
        console.log('account: ', account)
        const { data } = await axios(`${url}/v1/chain/get_abi`, {
          method: 'POST',
          data: {
            account_name: account
          }
        })
        console.log('data: ', data)
        return data.abi
      }
    }
  }
}

const App = () => {

  const onPressIdentity = async () => {
    const config = {
      // you must register your app's deep linking for following callback to work!
      callback: `myapp://identity?id={{sa}}`,
      chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
      account: '',
      expire_seconds: 600,
      name: 'identity',
      authorization: [
        {
          actor: '............1',
          permission: '............2'
        }
      ],
      data: {
        permission: {
          actor: '............1',
          permission: '............2'
        }
      }
    }
    console.log('identity request config: ', JSON.stringify(config))
    const req1 = SigningRequest.identity(config, getEsrOptions('https://telos.caleos.io'))
    console.log('req1 created: ', req1)
    const encoded = req1.encode()
    console.log('encoded: ', encoded)
    console.log(inspect(req1, false, null, true))
    const canOpen = await Linking.canOpenURL(encoded)
    console.log('canOpen: ', canOpen)
    Linking.openURL(encoded)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onPressIdentity} style={styles.identityWrap}>
        <Text>Get Identity</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  identityWrap: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default App
