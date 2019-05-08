<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
      justify-center
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4 md8>
        <h1 class="display-2 font-weight-bold mb-3">
          Proyecto Brigada
        </h1>
        <p class="subheading font-weight-regular">
          Cumpliendo con el proyecto que me dejó Fortana usando VUE.js y Vuetify. Consiste en un mapa de google al lado de tarjetas con las acciones de la organización determinad apor la URL. Todos los datos son obtenidos por la API REST de <a href="https://brigada.mx">Brigada</a>.
        </p>
        <p class="subheading font-weight-regular">
          Disculpa por las alertas default del explorador y el diseño responsivo. No me dio tiempo mejorar estos aspectos. ¡Por lo menos hice lo del zoom automático!
        </p>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Algunos Ejemplos</h2>

        <v-layout justify-center>
          <router-link
            v-for="(eco, i) in ecosystem"
            :key="i"
            :to="eco.to"
            class="subheading mx-3"
          >
            {{ eco.text }}
          </router-link>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      ecosystem: [
        {
          text: 'Organización 4',
          to: '/4'
        },
        {
          text: 'Organización 136',
          to: '/136'
        },
        {
          text: 'Organización 5',
          to: '/5'
        }
      ],

    })
  }
</script>

<style>

</style>
