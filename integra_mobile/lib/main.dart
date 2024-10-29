import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:http/http.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cadastro de Nota Fiscal',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: WizardPage(),
    );
  }
}

class WizardPage extends StatefulWidget {
  @override
  _WizardPageState createState() => _WizardPageState();
}

class _WizardPageState extends State<WizardPage> {
  final PageController _pageController = PageController();
  final _formKey1 = GlobalKey<FormState>();
  final _formKey2 = GlobalKey<FormState>();
  final _formKey3 = GlobalKey<FormState>();

  final TextEditingController _dataController = TextEditingController();
  final TextEditingController _estabelecimentoController =
      TextEditingController();
  final TextEditingController _valorController = TextEditingController();
  final TextEditingController _contaController = TextEditingController();

  List<XFile>? _imagesFiles = [];

  final ImagePicker _picker = ImagePicker();
  XFile? _image;

  String basename(String path) {
    return path.split('/').last;
  }

  // Função para enviar as imagens e os campos de texto via POST
  Future<void> _uploadImages() async {
    // Substitua pelo seu endereço de servidor
    final uri = Uri.parse("https://example.com/upload");

    // Crie a lista de arquivos para enviar
    List<MultipartFile> files = [];
    for (var imageFile in _imagesFiles!) {
      var file = await MultipartFile.fromPath(
        'files', // nome do campo que será enviado para o servidor
        imageFile.path,
        filename: basename(imageFile.path), // Nome do arquivo
      );
      files.add(file);
    }

    // Crie a requisição POST multipart
    var request = http.MultipartRequest('POST', uri)
      ..fields['dataController'] = _dataController.text
      ..fields['estabelecimentoController'] = _estabelecimentoController.text
      ..fields['valorController'] = _valorController.text
      ..fields['contaController'] = _contaController.text
      ..files.addAll(files);

    // Envie a requisição
    var response = await request.send();

    if (response.statusCode == 200) {
      print('Imagens e campos de texto enviados com sucesso!');
    } else {
      print(
          'Falha ao enviar os dados. Código de status: ${response.statusCode}');
    }
  }

  void _nextPage() {
    if (_pageController.page?.toInt() == 0 &&
        _formKey1.currentState?.validate() == true) {
      _pageController.nextPage(
          duration: Duration(milliseconds: 300), curve: Curves.easeIn);
    } else if (_pageController.page?.toInt() == 1 &&
        _formKey2.currentState?.validate() == true) {
      _pageController.nextPage(
          duration: Duration(milliseconds: 300), curve: Curves.easeIn);
    }
  }

  void _previousPage() {
    _pageController.previousPage(
        duration: Duration(milliseconds: 300), curve: Curves.easeIn);
  }

  // Função para abrir a câmera
  Future<ImageSource?> _openCamera() async {
    SnackBar(
      content: Text('_openCamera'),
    );

    // Verifica se a permissão para usar a câmera foi concedida
    var status = await Permission.camera.status;

    // Se a permissão ainda não foi concedida, solicita a permissão
    if (!status.isGranted) {
      status = await Permission.camera.request();
    }
    print(" permissão " + status.isGranted.toString());
    // Se a permissão foi concedida, abra a câmera para capturar a imagem

    if (status.isGranted == false) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Permissão para acessar a câmera negada.'),
        ),
      );
      return null;
    }

    return ImageSource.camera;
  }

  Future<void> _pickImage(BuildContext context) async {
    final int? sourceChoosed = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Escolha a origem da imagem'),
        actions: [
          TextButton(
            //Abre a camera do android
            onPressed: () => 1,
            //onPressed: () => Navigator.pop(context, ImageSource.camera),
            child: Text('Tirar Foto'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, 2),
            //onPressed: () => Navigator.pop(context, ImageSource.gallery),
            child: Text('Selecionar da Galeria'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, 3),
            //onPressed: () => Navigator.pop(context, null),
            child: Text('Cancelar'),
          ),
        ],
      ),
    );

    print(sourceChoosed.toString() + " sourceChoosed");

    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.camera);

    //if (source != null) {
    //  final XFile? image = await _picker.pickImage(source: source);
    setState(() {
      if (image != null) _imagesFiles?.add(image);
    });
    // }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Cadastro de Nota Fiscal')),
      body: PageView(
        controller: _pageController,
        children: [
          // Passo 1: Informações Básicas
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey1,
              child: Column(
                children: [
                  TextFormField(
                    controller: _dataController,
                    decoration: InputDecoration(labelText: 'Data'),
                    keyboardType: TextInputType.datetime,
                    validator: (value) =>
                        value?.isEmpty == true ? 'Campo obrigatório' : null,
                  ),
                  TextFormField(
                    controller: _estabelecimentoController,
                    decoration: InputDecoration(labelText: 'Estabelecimento'),
                    validator: (value) =>
                        value?.isEmpty == true ? 'Campo obrigatório' : null,
                  ),
                  TextFormField(
                    controller: _valorController,
                    decoration: InputDecoration(labelText: 'Valor Total'),
                    keyboardType: TextInputType.number,
                    validator: (value) =>
                        value?.isEmpty == true ? 'Campo obrigatório' : null,
                  ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _nextPage,
                    child: Text('Próximo'),
                  ),
                ],
              ),
            ),
          ),
          // Passo 2: Conta de Origem
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey2,
              child: Column(
                children: [
                  TextFormField(
                    controller: _contaController,
                    decoration: InputDecoration(labelText: 'Conta de Origem'),
                    validator: (value) =>
                        value?.isEmpty == true ? 'Campo obrigatório' : null,
                  ),
                  SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ElevatedButton(
                        onPressed: _previousPage,
                        child: Text('Anterior'),
                      ),
                      ElevatedButton(
                        onPressed: _nextPage,
                        child: Text('Próximo'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          // Passo 3: Cadastro de Fotos
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _imagesFiles == null
                    ? Text('Nenhuma imagem selecionada.')
                    : Expanded(
                        child: ListView.builder(
                          padding: const EdgeInsets.all(8),
                          itemCount: _imagesFiles!.length,
                          itemBuilder: (BuildContext context, int index) {
                            return Container(
                              margin: const EdgeInsets.symmetric(vertical: 10),
                              height: 200,
                              decoration: BoxDecoration(
                                color: Colors.amber[600],
                                //Image.file(File(_imageFile!.path))
                                image: DecorationImage(
                                  image: FileImage(File(
                                      _imagesFiles!.elementAt(index).path)),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => _pickImage(context),
                  child: Text('Adicionar Foto'),
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    // Aqui você pode adicionar o código para enviar os dados
                    // do formulário para o servidor ou qualquer outra ação.
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Dados enviados com sucesso!')),
                    );
                  },
                  child: Text('Enviar'),
                ),
                //Adiciona uma lista para visualizar as miniaturas das imagens selecionadas

                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _previousPage,
                  child: Text('Anterior'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
