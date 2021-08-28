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

package object

import "github.com/casbin/casdoor/util"

func InitDb() {
	initBuiltInOrganization()
	initBuiltInUser()
	initBuiltInApplication()
	initBuiltInLdap()
}

func initBuiltInOrganization() {
	organization := getOrganization("admin", "built-in")
	if organization != nil {
		return
	}

	organization = &Organization{
		Owner:         "admin",
		Name:          "built-in",
		CreatedTime:   util.GetCurrentTime(),
		DisplayName:   "Built-in Organization",
		WebsiteUrl:    "https://example.com",
		Favicon:       "https://cdn.casbin.com/static/favicon.ico",
		PhonePrefix:   "86",
		DefaultAvatar: "https://casbin.org/img/casbin.svg",
		PasswordType:  "plain",
	}
	AddOrganization(organization)
}

func initBuiltInUser() {
	user := getUser("built-in", "admin")
	if user != nil {
		return
	}

	user = &User{
		Owner:         "built-in",
		Name:          "admin",
		CreatedTime:   util.GetCurrentTime(),
		Id:            util.GenerateId(),
		Type:          "normal-user",
		Password:      "123",
		DisplayName:   "Admin",
		Avatar:        "https://casbin.org/img/casbin.svg",
		Email:         "admin@example.com",
		Phone:         "12345678910",
		Address:       []string{},
		Affiliation:   "Example Inc.",
		Tag:           "staff",
		Score:         2000,
		IsAdmin:       true,
		IsGlobalAdmin: true,
		IsForbidden:   false,
		Properties:    make(map[string]string),
	}
	AddUser(user)
}

func initBuiltInApplication() {
	application := getApplication("admin", "app-built-in")
	if application != nil {
		return
	}

	application = &Application{
		Owner:          "admin",
		Name:           "app-built-in",
		CreatedTime:    util.GetCurrentTime(),
		DisplayName:    "Casdoor",
		Logo:           "https://cdn.casbin.com/logo/logo_1024x256.png",
		HomepageUrl:    "https://casdoor.org",
		Organization:   "built-in",
		EnablePassword: true,
		EnableSignUp:   true,
		Providers:      []*ProviderItem{},
		SignupItems:    []*SignupItem{},
		RedirectUris:   []string{},
		ExpireInHours:  168,
	}
	AddApplication(application)
}

func initBuiltInLdap() {
	ldap := GetLdap("ldap-built-in")
	if ldap != nil {
		return
	}

	ldap = &Ldap{
		Id:         "ldap-built-in",
		Owner:      "built-in",
		ServerName: "BuildIn LDAP Server",
		Host:       "example.com",
		Port:       389,
		Admin:      "cn=buildin,dc=example,dc=com",
		Passwd:     "123",
		BaseDn:     "ou=BuildIn,dc=example,dc=com",
		AutoSync:   0,
		LastSync:   "",
	}
	AddLdap(ldap)
}
