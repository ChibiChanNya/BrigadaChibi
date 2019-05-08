<template>
    <div class="org">
        <v-dialog
                v-model="loading"
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    Cargando . . .
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-layout
                text-xs-center
                wrap
                row
        >
            <v-flex md2 px-2>
                <v-card v-for="item in organization" :key="item.id"
                        elevation="2" class="my-2"
                        @mouseover="highlight_markers(item, true)"
                        @mouseleave="highlight_markers(item, false)"
                >
                    <v-img
                            class="white--text"
                            height="150px" contain
                            :src="item.images? item.images[0] : 'https://www.psionline.com/wp-content/uploads/placeholder-rectangle.png'"
                    >
                    </v-img>
                    <v-card-actions>
                        <v-dialog v-model="item.dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                            <template v-slot:activator="{ on }">
                                <v-btn color="green" class="mx-auto" v-if="item.images.length>1" v-on="on">Ver
                                    +{{item.images.length-1}} imágenes
                                </v-btn>
                            </template>
                            <v-card>
                                <v-toolbar dark color="green">
                                    <v-btn icon dark @click="item.dialog = false">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>Imágenes</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <h3>Estás imágenes estan muy pesadas y es mala idea cargarlas. Les dejo un "proof of concept" mientras.</h3>
                                </v-toolbar>
                                <v-container
                                        fluid
                                        grid-list-md
                                >
                                    <v-layout row wrap>
                                        <v-flex
                                                v-for="(image, index) in 8"
                                                :key="index"
                                                md3
                                        >
                                            <v-card>
                                                <v-img
                                                        src="https://www.psionline.com/wp-content/uploads/placeholder-rectangle.png"
                                                        height="200px"
                                                >
                                                </v-img>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-dialog>


                    </v-card-actions>
                </v-card>
            </v-flex>

            <v-flex md10>
                <div style="width:100%;height:99vh;position:fixed">
                    <GmapMap ref="mapRef"
                             :center="{lat:0, lng:0}"
                             map-type-id="terrain"
                             style="width: 80%; height: 100%;"
                             :options="{mapTypeControl: false,
                               scaleControl: false,
                               streetViewControl: false,
                               rotateControl: false,
                               disableDefaultUi: false
                               }"

                    >
                        <GmapMarker
                                :key="index"
                                v-for="(m, index) in markers"
                                :position="m.position"
                                :clickable="true"
                                :icon="m.icon"
                        />
                    </GmapMap>
                </div>
            </v-flex>

        </v-layout>

    </div>
</template>

<script>
  // @ is an alias to /src
  import {gmapApi} from 'vue2-google-maps'

  export default {
    name: 'organization',

    data() {
      return {
        organization: [],
        loading: true,
      }
    },

    computed: {

      google: gmapApi,

      markers: function () {
        if (!this.organization) {
          return [];
        }
        return this.organization.reduce(function (prev, next) {
          return prev.concat(next.markers)
        }, []).map((item) => {
          return {
            position: {
              lat: item.lat,
              lng: item.lng,
            },
            icon: item.icon,
          }
        });
      },
    },

    mounted() {
      console.log(process.env);
      this.axios
          .get(`https://api.brigada.mx/api/organizations/${this.$route.params.id}/`)
          .then((response) => {
            if (response.data.action_count === 0) {
              alert("No hay acciones para esta organización");
              this.$router.push("/");
            }
            let org = response.data.actions.map((action) => {
              return {
                id: action.id,
                subs: action.submissions,
              };
            });
            this.organization = this.organize_subs(org);

            //  ADJUST MAP
            setTimeout(() => {
              this.setMapBounds();
              this.loading = false;
            }, 1000);

          })
          .catch((error) => {
            if (error) {
              console.log(error, this.$route);
              alert("Lo sentimos. No existe esa organización");
              this.$router.push("/");
            }
          });
    },

    beforeRouteUpdate(to, from, next) {
      this.loading = true;
      this.axios
          .get(`https://api.brigada.mx/api/organizations/${to.params.id}/`)
          .then((response) => {
            if (response.data.action_count === 0) {
              alert("No hay acciones para esta organización");
              this.$router.push("/");
            }
            let org = response.data.actions.map((action) => {
              return {
                id: action.id,
                subs: action.submissions,
              };
            });
            this.organization = this.organize_subs(org);
            next();
            //  ADJUST MAP
            this.setMapBounds();
            this.loading = false;
          })
          .catch((error) => {
            if (error ) {
              console.log(error, this.$route);
              alert("Lo sentimos. No existe esa organización");
              this.$router.push("/");
            }
          });
    },

    methods: {

      setMapBounds() {
        let bounds = new this.google.maps.LatLngBounds();

        this.markers.forEach(marker => {
          bounds.extend(new this.google.maps.LatLng(marker.position.lat, marker.position.lng));
        });

        this.$refs.mapRef.$mapPromise.then((map) => {
          map.fitBounds(bounds, 2);
        });
        this.$gmapDefaultResizeBus.$emit("resize");
      },


      organize_subs(action) {

        // Organize Images and markets
        action.forEach(function (org) {
          org.images = org.subs.reduce(function (prevd, nextd) {
            return prevd.concat(nextd.images.map(img => img.url));
          }, []);
          org.markers = org.subs.reduce(function (prevd, nextd) {
            return prevd.concat(nextd.location);
          }, []);

          org.markers.forEach((item) => {
            item.icon = {url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
          });

          org.dialog = false;
        });
        return action;
      },

      highlight_markers(action, status) {
        action.markers.forEach((marker) => {
          marker.icon = status ? {url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'} : {url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
        });
      }

    },

  }
</script>

<style>
    .sticky {
        position: -webkit-sticky;
        position: sticky;
    }

    .screen {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.3);
        z-index: 200;
    }
</style>