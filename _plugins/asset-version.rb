module Jekyll
  module AssetVersionFilter
    def versioned_url(input)
    	version = md5_version(input)
    	if version != nil
    		"#{input}?v=#{version}"
    	else
    		input
    	end
    end

    def md5_version(input)
    	input_path = File.join(Dir.pwd, input)
    	if File.file?(input_path)
    		Digest::MD5.file(input_path).hexdigest
    	else
	    	if input.include? '.css' # handle uncompiled css
	    		input = input.gsub('.css', '.scss')
				  md5_version(input)
				else
					nil
				end
    	end
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetVersionFilter)