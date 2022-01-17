# Helpers
def blob_to_str(blob):
  return str(blob)[0:len(str(blob))-1]

def get_cmd_output(cmd):
  return blob_to_str(local(cmd))

def install_dev_dependencies(deps):
  for command in deps:
    out = local('command -v {} || echo "not found"'.format(command))
    if blob_to_str(out) == "not found":
      print("{} command not exist.".format(command))
      print("Installing {} package".format(command))
      local(dependencies[command])
    else:
      print("{} found!".format(command))

def start_minikube(desired_memory_capacity):
  current_memory_capacity = get_cmd_output('minikube config get memory')

  if int(current_memory_capacity) < int(desired_memory_capacity):
    local('minikube config set memory {}'.format(desired_memory_capacity))
    local('minikube delete')
    local('minikube start')
  else:
    number_of_running_words = int(get_cmd_output('minikube status | grep Running | wc -l ').lstrip(' '))
    if not number_of_running_words == 3:
      print("Starting minikube....")
      local('minikube start')

# Tilt Commands
dependencies = {
  "node": "nvm install 12.18.3",
  "yarn": "brew install yarn",
}

install_dev_dependencies(dependencies)

start_minikube("6144")

include('../payment-api/Tiltfile')

docker_build('payment-mf-image', '.',
  live_update=[
    # when package.json changes, we need to do a full build
    fall_back_on(['package.json', 'package-lock.json']),
    # Map the local source code into the container under /app
    sync('.', '/app'),
  ],
  dockerfile = 'Dockerfile.dev',
  ignore = ['.nuxt/']
)

k8s_yaml(['.dev/deployment.yaml'])

k8s_resource('payment-mf', port_forwards=3000)
