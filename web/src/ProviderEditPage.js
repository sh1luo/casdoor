// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Button, Card, Col, Input, InputNumber, Row, Select} from 'antd';
import {LinkOutlined} from "@ant-design/icons";
import * as ProviderBackend from "./backend/ProviderBackend";
import * as Setting from "./Setting";
import i18next from "i18next";

const { Option } = Select;
const { TextArea } = Input;

class ProviderEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      providerName: props.match.params.providerName,
      provider: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getProvider();
  }

  getProvider() {
    ProviderBackend.getProvider("admin", this.state.providerName)
      .then((provider) => {
        this.setState({
          provider: provider,
        });
      });
  }

  parseProviderField(key, value) {
    if (["port"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateProviderField(key, value) {
    value = this.parseProviderField(key, value);

    let provider = this.state.provider;
    provider[key] = value;
    this.setState({
      provider: provider,
    });
  }

  getProviderTypeOptions(provider) {
    if (provider.category === "OAuth") {
      return (
        [
          {id: 'Google', name: 'Google'},
          {id: 'GitHub', name: 'GitHub'},
          {id: 'QQ', name: 'QQ'},
          {id: 'WeChat', name: 'WeChat'},
          {id: 'Facebook', name: 'Facebook'},
          {id: 'DingTalk', name: 'DingTalk'},
          {id: 'Weibo', name: 'Weibo'},
          {id: 'Gitee', name: 'Gitee'},
          {id: 'LinkedIn', name: 'LinkedIn'},
          {id: 'WeCom', name: 'WeCom'},
        ]
      );
    } else if (provider.category === "Email") {
      return (
        [
          {id: 'Default', name: 'Default'},
        ]
      );
    } else if (provider.category === "SMS") {
      return (
        [
          {id: 'Aliyun SMS', name: 'Aliyun SMS'},
          {id: 'Tencent Cloud SMS', name: 'Tencent Cloud SMS'},
          {id: 'Volc Engine SMS', name: 'Volc Engine SMS'},
        ]
      );
    } else if (provider.category === "Storage") {
      return (
        [
          {id: 'Local File System', name: 'Local File System'},
          {id: 'AWS S3', name: 'AWS S3'},
          {id: 'Aliyun OSS', name: 'Aliyun OSS'},
        ]
      );
    } else {
      return [];
    }
  }

  getClientIdLabel() {
    switch (this.state.provider.category) {
      case "Email":
        return Setting.getLabel(i18next.t("signup:Username"), i18next.t("signup:Username - Tooltip"));
      case "SMS":
        if (this.state.provider.type === "Volc Engine SMS")
          return Setting.getLabel(i18next.t("provider:Access key"), i18next.t("provider:Access key - Tooltip"));
      default:
        return Setting.getLabel(i18next.t("provider:Client ID"), i18next.t("provider:Client ID - Tooltip"));
    }
  }

  getClientSecretLabel() {
    switch (this.state.provider.category) {
      case "Email":
        return Setting.getLabel(i18next.t("login:Password"), i18next.t("login:Password - Tooltip"));
      case "SMS":
        if (this.state.provider.type === "Volc Engine SMS")
          return Setting.getLabel(i18next.t("provider:Secret access key"), i18next.t("provider:SecretAccessKey - Tooltip"));
      default:
        return Setting.getLabel(i18next.t("provider:Client secret"), i18next.t("provider:Client secret - Tooltip"));
    }
  }

  getAppIdRow() {
    let text, tooltip;
    if (this.state.provider.category === "SMS" && this.state.provider.type === "Tencent Cloud SMS") {
      text = "provider:App ID";
      tooltip = "provider:App ID - Tooltip";
    } else if (this.state.provider.category === "SMS" && this.state.provider.type === "Volc Engine SMS") {
      text = "provider:SMS account";
      tooltip = "provider:SMS account - Tooltip";
    } else {
      return null;
    }

    return <Row style={{marginTop: '20px'}} >
      <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
        {Setting.getLabel(i18next.t(text), i18next.t(tooltip))} :
      </Col>
      <Col span={22} >
        <Input value={this.state.provider.appId} onChange={e => {
          this.updateProviderField('appId', e.target.value);
        }} />
      </Col>
    </Row>;
  }

  renderProvider() {
    return (
      <Card size="small" title={
        <div>
          {i18next.t("provider:Edit Provider")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitProviderEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={(Setting.isMobile())? {margin: '5px'}:{}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("general:Name"), i18next.t("general:Name - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Input value={this.state.provider.name} onChange={e => {
              this.updateProviderField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("general:Display name"), i18next.t("general:Display name - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Input value={this.state.provider.displayName} onChange={e => {
              this.updateProviderField('displayName', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("provider:Category"), i18next.t("provider:Category - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.provider.category} onChange={(value => {
              this.updateProviderField('category', value);
              if (value === "OAuth") {
                this.updateProviderField('type', 'GitHub');
              } else if (value === "Email") {
                this.updateProviderField('type', 'Default');
                this.updateProviderField('title', 'Casdoor Verification Code');
                this.updateProviderField('content', 'You have requested a verification code at Casdoor. Here is your code: %s, please enter in 5 minutes.');
              } else if (value === "SMS") {
                this.updateProviderField('type', 'Aliyun SMS');
              } else if (value === "Storage") {
                this.updateProviderField('type', 'Local File System');
                this.updateProviderField('domain', Setting.getFullServerUrl());
              }
            })}>
              {
                [
                  {id: 'OAuth', name: 'OAuth'},
                  {id: 'Email', name: 'Email'},
                  {id: 'SMS', name: 'SMS'},
                  {id: 'Storage', name: 'Storage'},
                ].map((providerCategory, index) => <Option key={index} value={providerCategory.id}>{providerCategory.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("provider:Type"), i18next.t("provider:Type - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.provider.type} onChange={(value => {
              this.updateProviderField('type', value);
              if (value === "Local File System") {
                this.updateProviderField('domain', Setting.getFullServerUrl());
              }
            })}>
              {
                this.getProviderTypeOptions(this.state.provider).map((providerType, index) => <Option key={index} value={providerType.id}>{providerType.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {this.getClientIdLabel()}
          </Col>
          <Col span={22} >
            <Input value={this.state.provider.clientId} onChange={e => {
              this.updateProviderField('clientId', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {this.getClientSecretLabel()}
          </Col>
          <Col span={22} >
            <Input value={this.state.provider.clientSecret} onChange={e => {
              this.updateProviderField('clientSecret', e.target.value);
            }} />
          </Col>
        </Row>
        {this.state.provider.category === "Storage" ? (
          <div>
            <Row style={{marginTop: '20px'}} >
              <Col style={{marginTop: '5px'}} span={2}>
                {Setting.getLabel(i18next.t("provider:Endpoint"), i18next.t("provider:Endpoint - Tooltip"))} :
              </Col>
              <Col span={22} >
                <Input value={this.state.provider.endpoint} onChange={e => {
                  this.updateProviderField('endpoint', e.target.value);
                }} />
              </Col>
            </Row>
            <Row style={{marginTop: '20px'}} >
              <Col style={{marginTop: '5px'}} span={2}>
                {Setting.getLabel(i18next.t("provider:Bucket"), i18next.t("provider:Bucket - Tooltip"))} :
              </Col>
              <Col span={22} >
                <Input value={this.state.provider.bucket} onChange={e => {
                  this.updateProviderField('bucket', e.target.value);
                }} />
              </Col>
            </Row>
            <Row style={{marginTop: '20px'}} >
              <Col style={{marginTop: '5px'}} span={2}>
                {Setting.getLabel(i18next.t("provider:Domain"), i18next.t("provider:Domain - Tooltip"))} :
              </Col>
              <Col span={22} >
                <Input value={this.state.provider.domain} onChange={e => {
                  this.updateProviderField('domain', e.target.value);
                }} />
              </Col>
            </Row>
            {this.state.provider.type === "AWSS3" ? (
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {Setting.getLabel(i18next.t("provider:Region"), i18next.t("provider:Region - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input value={this.state.provider.regionId} onChange={e => {
                    this.updateProviderField('regionId', e.target.value);
                  }} />
                </Col>
              </Row>
            ) : null}
          </div>
        ) : null}
        {
          this.state.provider.category === "Email" ? (
            <React.Fragment>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Host"), i18next.t("provider:Host - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input prefix={<LinkOutlined/>} value={this.state.provider.host} onChange={e => {
                    this.updateProviderField('host', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Port"), i18next.t("provider:Port - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <InputNumber value={this.state.provider.port} onChange={value => {
                    this.updateProviderField('port', value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Email Title"), i18next.t("provider:Email Title - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input value={this.state.provider.title} onChange={e => {
                    this.updateProviderField('title', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Email Content"), i18next.t("provider:Email Content - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <TextArea autoSize={{minRows: 1, maxRows: 100}} value={this.state.provider.content} onChange={e => {
                    this.updateProviderField('content', e.target.value);
                  }} />
                </Col>
              </Row>
            </React.Fragment>
          ) : this.state.provider.category === "SMS" ? (
            <React.Fragment>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Region ID"), i18next.t("provider:Region ID - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input value={this.state.provider.regionId} onChange={e => {
                    this.updateProviderField('regionId', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Sign Name"), i18next.t("provider:Sign Name - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input value={this.state.provider.signName} onChange={e => {
                    this.updateProviderField('signName', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {Setting.getLabel(i18next.t("provider:Template Code"), i18next.t("provider:Template Code - Tooltip"))} :
                </Col>
                <Col span={22} >
                  <Input value={this.state.provider.templateCode} onChange={e => {
                    this.updateProviderField('templateCode', e.target.value);
                  }} />
                </Col>
              </Row>
            </React.Fragment>
          ) : null
        }
        {this.getAppIdRow()}
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("provider:Provider URL"), i18next.t("provider:Provider URL - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Input prefix={<LinkOutlined/>} value={this.state.provider.providerUrl} onChange={e => {
              this.updateProviderField('providerUrl', e.target.value);
            }} />
          </Col>
        </Row>
      </Card>
    )
  }

  submitProviderEdit() {
    let provider = Setting.deepCopy(this.state.provider);
    ProviderBackend.updateProvider(this.state.provider.owner, this.state.providerName, provider)
      .then((res) => {
        if (res.msg === "") {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            providerName: this.state.provider.name,
          });
          this.props.history.push(`/providers/${this.state.provider.name}`);
        } else {
          Setting.showMessage("error", res.msg);
          this.updateProviderField('name', this.state.providerName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Failed to connect to server: ${error}`);
      });
  }

  render() {
    return (
      <div>
        {
          this.state.provider !== null ? this.renderProvider() : null
        }
        <div style={{marginTop: '20px', marginLeft: '40px'}}>
          <Button type="primary" size="large" onClick={this.submitProviderEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      </div>
    );
  }
}

export default ProviderEditPage;
