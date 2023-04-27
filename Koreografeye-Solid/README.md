# Koreografeye Solid plugin

A [koreografeye](https://www.npmjs.com/package/koreografeye) plugin to update a Solid pod. The plugin implements Solid CSS client credentials to provide a long lasting login sessions. 

## Install

```
npm install koreografeye-solid
```

Change the [config.jsonld](https://raw.githubusercontent.com/eyereasoner/Koreografeye-Solid/main/config.jsonld) configuration file and add the plugin definition.

In `@context` add `"https://linkedsoftwaredependencies.org/bundles/npm/koreografeye-solid/^0.0.0/components/context.jsonld"`.

Add the plugin definition:

```
{
  "@id": "http://example.org/sendToSolid",
  "@type": "SolidPlugin",
  "authenticator": {
  "@type": "SolidCSSAuthenticator",
     "options": {
        "@type": "@json",
        "@value": {
            "token" : "./mytoken"
        }
     }
  }
}
```

The `./mytoken` file can be created by running:

```
npx token_client <name> <email> <idp> > ./mytoken
```

where:

- `name` is a descriptive name for your session
- `email` is the email used to authenticate to a Solid CSS instance
- `idp` is the identity provider url (typically the url of your Solid CSS pod)

The `token_client` will prompt you for a password.

## Usage

The Koreografeye N3 rules should produce a `ex:sendToSolid` policy to trigger
this plugin. An example N3 rule file is provided below:

```
@prefix ex:   <http://example.org/> .
@prefix as:   <https://www.w3.org/ns/activitystreams#> .
@prefix pol:  <https://www.example.org/ns/policy#> .
@prefix fno:  <https://w3id.org/function/ontology#> .

{
  # pol:mainSubject defines the top level identifier of the notification
  [ pol:mainSubject ?id ] .
  
  ?id a as:Update .
}
=>
{
  ex:MyDemoPolicy pol:policy [
      a fno:Execution ;
      fno:executes ex:sendToSolid ;
      ex:method "PUT" ;
      ex:endpoint "https://patrickhochstenbach.net/test/koreografeye/demo.ttl";
      ex:body ?id
  ] .
}.
```

In the N3 rule above we will request the execution of the `ex:sendToSolid`
plugin when the input data contains a mainSubject of type `as:Update`.

The plugin requires three parameters:

- `ex:method` : the HTTP method to use
- `ex:endpoint` : the endpoint to connect to
- `ex:body` : the RDF fragment to send to the endpoint
  
## Development

### Install dependencies

```
npm install 
```

### Build

```
npm run build
```

### Demo

Update `rules/demo.n3` and change `endpoint` to a (world) writable resource.

Run an orchestrator run on `in/demo.ttl` using the `rules/demo.n3` N3 policy rules:

```
npm run orch
```

This should create a new `out/demo.ttl` file with the required N3 policies included.

Run the policy executor

```
npm run pol
```

The policy executor should have updated the remote resource.