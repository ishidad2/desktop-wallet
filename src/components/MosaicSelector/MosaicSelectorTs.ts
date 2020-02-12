/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {MosaicId, MosaicInfo, Mosaic, RawUInt64} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {MosaicService} from '@/services/MosaicService'
import {MosaicsModel} from '@/core/database/entities/MosaicsModel'

// child components
// @ts-ignore
import ErrorTooltip from '@/components//ErrorTooltip/ErrorTooltip.vue'

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {...mapGetters({
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicName: 'mosaic/networkMosaicName',
    mosaicsInfo: 'mosaic/mosaicsInfoList',
    mosaicsNames: 'mosaic/mosaicsNames',
  })}
})
export class MosaicSelectorTs extends Vue {

  @Prop({
    default: ''
  }) value: string

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Networks currency mosaic name
   * @var {string}
   */
  public networkMosaicName: string

  /**
   * Network mosaics info (all)
   * @see {Store.Mosaic}
   * @var {MosaicInfo[]}
   */
  public mosaicsInfo: MosaicInfo[]

  /**
   * Network mosaics names (all)
   * @see {Store.Mosaic}
   * @var {string[]}
   */
  public mosaicsNames: any

  public created() {
    this.selectedMosaicName = this.networkMosaicName
  }

/// region computed properties getter/setter
  public get mosaics(): MosaicsModel[] {
    const service = new MosaicService(this.$store)
    return service.getMosaics()
  }

  public get selectedMosaic(): string {
    return this.mosaics.filter(
      m => m.values.get('name') === this.selectedMosaicName
    ).shift().getIdentifier()
  }

  public set selectedMosaic(hex: string) {
    this.$emit('input', hex)
  }

  public get selectedMosaicName(): string {
    const selected = this.value || this.networkMosaic.toHex()
    const id = new MosaicId(RawUInt64.fromHex(selected))
    return this.mosaics.filter(
      m => m.getIdentifier() === selected
    ).shift().values.get('name')
  }

  public set selectedMosaicName(name: string) {
    this.selectedMosaic = this.mosaics.filter(
      m => m.values.get('name') === name
    ).shift().getIdentifier()
  }
  /// end-region computed properties getter/setter

  public onChange (input: string) {
    const canFindByName = this.mosaics.find(m => m.values.get('name') === input)
    if (undefined !== canFindByName) {
      return this.selectedMosaicName = canFindByName.values.get('name')
    }

    const canFindByHex = this.mosaics.find(m => m.getIdentifier() === input)
    if (undefined !== canFindByHex) {
      return this.selectedMosaicName = canFindByHex.values.get('name')
    }
  }
}
