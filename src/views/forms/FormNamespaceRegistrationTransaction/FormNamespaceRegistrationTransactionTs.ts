/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import {
  NamespaceId,
  NamespaceRegistrationTransaction,
  NamespaceRegistrationType,
  Transaction,
  UInt64,
} from 'symbol-sdk'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
// internal dependencies
import {
  NamespaceRegistrationFormFieldsType,
  ViewNamespaceRegistrationTransaction,
} from '@/core/transactions/ViewNamespaceRegistrationTransaction'
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase'
import { TransactionFactory } from '@/core/transactions/TransactionFactory'
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
// @ts-ignore
import NamespaceSelector from '@/components/NamespaceSelector/NamespaceSelector.vue'
// @ts-ignore
import NamespaceNameInput from '@/components/NamespaceNameInput/NamespaceNameInput.vue'
// @ts-ignore
import DurationInput from '@/components/DurationInput/DurationInput.vue'
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue'
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue'
// configuration
import { NamespaceModel } from '@/core/database/entities/NamespaceModel'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'
import { NamespaceService } from '@/services/NamespaceService'

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    FormRow,
    FormWrapper,
    SignerSelector,
    NamespaceNameInput,
    NamespaceSelector,
    DurationInput,
    ModalTransactionConfirmation,
    MaxFeeAndSubmit,
  },
  computed: {
    ...mapGetters({
      ownedNamespaces: 'namespace/ownedNamespaces',
      currentHeight: 'network/currentHeight',
      networkConfiguration: 'network/networkConfiguration',
    }),
  },
})
export class FormNamespaceRegistrationTransactionTs extends FormTransactionBase {
  @Prop({ default: null }) signer: string
  @Prop({ default: null }) registrationType: NamespaceRegistrationType
  @Prop({ default: null }) namespaceId: NamespaceId
  @Prop({ default: null }) parentNamespaceId: NamespaceId
  @Prop({ default: null }) duration: number

  protected networkConfiguration: NetworkConfigurationModel
  /**
   * Current account's owned namespaces
   */
  public ownedNamespaces: NamespaceModel[]

  /**
   * Root namespace type exposed to view
   * @var {NamespaceRegistrationType}
   */
  public typeRootNamespace = NamespaceRegistrationType.RootNamespace

  /**
   * Sub namespace type exposed to view
   * @var {NamespaceRegistrationType}
   */
  public typeSubNamespace = NamespaceRegistrationType.SubNamespace

  /**
   * Current network block height
   */
  public currentHeight: number

  /**
   * Form items
   * @var {Record<string, any>}
   */
  public formItems = {
    signerPublicKey: '',
    registrationType: NamespaceRegistrationType.RootNamespace,
    newNamespaceName: '',
    parentNamespaceName: '',
    duration: 172800,
    maxFee: 0,
  }

  /**
   * Namespaces that can have children
   * @readonly
   * @protected
   */
  protected get fertileNamespaces(): NamespaceModel[] {
    const maxNamespaceDepth = this.networkConfiguration.maxNamespaceDepth
    return this.ownedNamespaces.filter(({ depth }) => depth < maxNamespaceDepth)
  }

  /**
   * Reset the form with properties
   * @return {void}
   */
  protected resetForm() {
    // - set default form values
    this.formItems.signerPublicKey = this.currentAccount.publicKey
    this.formItems.registrationType = this.registrationType || NamespaceRegistrationType.RootNamespace
    this.formItems.newNamespaceName = this.namespaceId ? this.namespaceId.fullName : ''
    this.formItems.parentNamespaceName = this.parentNamespaceId ? this.parentNamespaceId.fullName : ''
    this.formItems.duration = this.duration || 172800

    // - maxFee must be absolute
    this.formItems.maxFee = this.defaultFee
  }

  /**
   * Getter for whether forms should aggregate transactions
   * @see {FormTransactionBase}
   * @return {boolean} True if creating namespace for multisig
   */
  protected isAggregateMode(): boolean {
    return this.isCosignatoryMode
  }

  /**
   * Getter for NAMESPACE REGISTRATION transactions that will be staged
   * @see {FormTransactionBase}
   * @return {TransferTransaction[]}
   */
  protected getTransactions(): Transaction[] {
    this.factory = new TransactionFactory(this.$store)
    try {
      // - read form for definition
      const data: NamespaceRegistrationFormFieldsType = {
        registrationType: this.formItems.registrationType,
        rootNamespaceName:
          NamespaceRegistrationType.RootNamespace === this.formItems.registrationType
            ? this.formItems.newNamespaceName
            : this.formItems.parentNamespaceName,
        subNamespaceName:
          NamespaceRegistrationType.SubNamespace === this.formItems.registrationType
            ? this.formItems.newNamespaceName
            : '',
        duration: this.formItems.duration,
        maxFee: UInt64.fromUint(this.formItems.maxFee),
      }

      // - prepare transaction
      let view = new ViewNamespaceRegistrationTransaction(this.$store)
      view = view.parse(data)

      // - return instantiated Transaction
      return [this.factory.build(view)]
    } catch (error) {
      console.error('Error happened in FormNamespaceRegistrationTransaction.transactions(): ', error)
    }
  }

  /**
   * Setter for TRANSFER transactions that will be staged
   * @see {FormTransactionBase}
   * @param {TransferTransaction[]} transactions
   * @throws {Error} If not overloaded in derivate component
   */
  protected setTransactions(transactions: Transaction[]) {
    // - this form creates 2 transaction
    const transaction = transactions.shift() as NamespaceRegistrationTransaction

    // - populate from transaction
    this.formItems.registrationType = transaction.registrationType
    this.formItems.newNamespaceName = transaction.namespaceName
    this.formItems.parentNamespaceName = transaction.parentId ? transaction.parentId.toHex() : ''
    this.formItems.duration = transaction.duration ? transaction.duration.compact() : 0

    // - populate maxFee
    this.formItems.maxFee = transaction.maxFee.compact()
  }

  public relativeTimetoParent = ''

  public getTimeByparentNamespaceName() {
    const selectedNamespace = this.ownedNamespaces.find((item) => item.name === this.formItems.parentNamespaceName)

    this.relativeTimetoParent = NamespaceService.getExpiration(
      this.networkConfiguration,
      this.currentHeight,
      selectedNamespace.endHeight,
    ).expiration
  }

  setParentNamespaceName(val) {
    this.formItems.parentNamespaceName = val
    this.getTimeByparentNamespaceName()
  }
}
